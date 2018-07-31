# Step 0: Download this repo


# Step 1: Install Node and NPM
You can find installation instructions here: https://nodejs.org/en/download/


# Step 2: Go to this repo in terminal/command-line
This involves opening terminal (MAC) (or cmd.exe/command-line (Windows)), then "cd" to the location of the scraper-backend folder


# Step 3: Install required packages
Enter "npm install" in your terminal


# Step 4: Start the application
You can start the application by running "npm start", from there the website should appear in one of your browser. If not, go to a browser and enter "http://localhost:5000/"


# Step 5: Get your developer credentials
You need to get your petfinder developer credentials (key and secret values) by registering as a developer at https://www.petfinder.com/developers/api-key


# Step 6: Create a .env file
In the scraper-backend folder, create a new file called *exactly* ".env". Open this file in some type of file editor (e.g. Notepad++, Sublime, Atom, etc), and add in:
"
SHANES_PETFINDER_KEY=...
SHANES_PETFINDER_SECRET=...
"

*Replace the three dots with your key and secret*
