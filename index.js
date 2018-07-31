require('dotenv').config();
const docx = require('docx');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const exphbs = require('express-handlebars');
const cheerio = require('cheerio');
const request = require('request');
const petfinderKey = process.env.SHANES_PETFINDER_KEY;
const petfinderSecret = process.env.SHANES_PETFINDER_SECRET;
const petfinder = require('petfinder-promise')(petfinderKey, petfinderSecret);

const forLoop = function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
};

const download = function(pet, filename, doc, result2, length, ogRes){
  request.head(pet.photo, function(err, res, body){
    request(pet.photo).pipe(fs.createWriteStream(filename)).on('close', () => {
      let paragraph = new docx.Paragraph(pet.link).style("Hidden1");
      doc.addParagraph(paragraph);

      const image = doc.createImage("./" + filename);

      paragraph = new docx.Paragraph(pet.name).heading1();
      doc.addParagraph(paragraph);

      paragraph = new docx.Paragraph(pet.breed + " " + pet.type + " - " + pet.gender+ " - " + pet.age + " - " + pet.size).heading2();
      doc.addParagraph(paragraph);

      paragraph = new docx.Paragraph("Extra Information: " + pet.extra).heading2();
      doc.addParagraph(paragraph);

      paragraph = new docx.Paragraph(pet.description);
      doc.addParagraph(paragraph);
      result2.push("");
      deleteFile(filename);
      console.log("Download made it at " + result2.length + " desired length is " + length)
      if (result2.length === length) {
        console.log("About to download ")
        // console.log(ogRes)
        const exporter = new docx.ExpressPacker(doc, ogRes);
        // let exporter = new docx.LocalPacker(doc);
        exporter.pack("TAGD_Personalized_Findings");
        // ogRes.render('home');
      }
    });
  });
};


app.engine('handlebars', exphbs({helpers: {times: forLoop}, defaultLayout: 'main'}))
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

app.get("/", (req, res) => {
  res.render('home')
});

app.post("/", (req, res) => {
  console.log(req.body);
  let links = req.body;
  let startingOptions = ["//www.petfinder.com"];
  for (let key in links) {
    if (!links[key].includes(startingOptions[0]) || links[key] === '') {
      delete links[key];
    }
  }

  let linkArray = Object.values(links);
  console.log(linkArray);
  let result = [];
  try {
    getResults(linkArray, result, res);
  } catch(err) {
    console.log(err);
    res.render('home');
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on " + (process.env.PORT ? process.env.PORT : '5000'));
});


const getResults = function(linkArray, result, ogRes) {
  // console.log("Inside get results, linkArray length")
  for (let i = 0; i < linkArray.length; i += 1) {
    // console.log("Inside first for loop at i = " + i)
    let aLink = linkArray[i];
    let index = -1;
    let count = 0;
    for (let j = 0; j < aLink.length; j++) {
      // console.log("Inside second for loop at j = " + j)
      let curr = aLink.charAt(j);
      if (curr === '/') {
        count += 1
      }
      if (count === 5) {
        index = j;
        break;
      }
    }
    if (index === -1) {
      continue;
    }
    index -= 1;
    let curr = String(aLink.charAt(index));
    let id = ''
    while (!(curr === '-')) {
      // console.log("Inside for loop, index: " + index + " curr " + curr);
      id += curr
      index -= 1;
      curr = String(aLink.charAt(index));
    }

    id = id.split("").reverse().join("");
    // console.log('This is id: ' + id);
    petfinder.pet.get(id).then((pet) => {
      console.log('Inside petfinder api, heres pets: ');
      console.log(pet);
      let size = pet.size;
      switch (size) {
        case("XL"):
          size = "Extra Large";
          break;
        case("L"):
          size = "Large";
          break;
        case("M"):
          size = "Medium";
          break;
        case("S"):
          size = "Small";
          break;
        default:
          size = pet.size;
          break;
      }
      result.push({
        photo: pet.media.photos['1'].x,
        link: aLink,
        name: pet.name,
        breed: pet.breeds.join(" & "),
        gender: (pet.sex === "" ? "" : (pet.sex === "M" ? "Male" : "Female")),
        age: pet.age,
        size,
        type: pet.animal,
        extra: seperateWords(pet.options.join(", ")),
        description: pet.description,
      })
      console.log("Inside petfinder api, result.length " + result.length + " linkArray.length " + linkArray.length)
      if (result.length === linkArray.length) {
        createDocument(result, ogRes);
      }
      // console.log(result);
    })
  }
}

const createDocument = function(result, ogRes) {
  let doc = new docx.Document();
  doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(28)
        .bold()
        .italics()
        .spacing({after: 120});
  doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
        .basedOn("Normal")
        .next("Normal")
        .quickFormat()
        .size(26)
        .bold()
        .underline('double', 'FF0000')
        .spacing({before: 240, after: 120});
  doc.Styles.createParagraphStyle("Hidden1", "Hidden 1")
        .color('ffffff')

  doc.createImage("./TAGD_LOGO.png");

  let result2 = [];
  for (let i = 0; i < result.length; i += 1) {
    let pet = result[i];
    let fileExt = '';

    let counter = pet.photo.length - 1;
    let curr = String(pet.photo.charAt(counter))
    while (!(curr === ".")) {
      fileExt += curr;
      counter -= 1;
      curr = String(pet.photo.charAt(counter))
    }
    fileExt += ".";
    fileExt = fileExt.split("").reverse().join("");


    download(pet, "photo" + i + fileExt, doc, result2, result.length, ogRes);
  }
}

function deleteFile(file) {
    fs.unlink(file, function (err) {
        if (err) {
            console.error(err.toString());
        } else {
            console.warn(file + ' deleted');
        }
    });
}

const seperateWords = function(input) {
  // console.log("Initial casing: " + input);
  for (let i = 0; i < input.length; i++) {
    let curr = input.charAt(i);
    // console.log("This is curr: " + curr);
    if (curr === curr.toUpperCase()) {
      // console.log("Was Upper Case");
      if (i === 0 || i === input.length - 1 || !isNaN(curr * 1)) {
        continue;
      }
      input = input.substring(0, i) + " " + input.charAt(i).toLowerCase() + input.substring(i + 1, input.length);
      i++;
    }
  }
  // console.log("Ending casing: " + input);
  return input;
}
