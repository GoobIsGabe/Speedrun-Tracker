# Speedrun-Tracker
Utilizing the tools available through https://therun.gg/ and https://speedrun.com/ this tool showcases the current updated pace, along with calls that can be made to a local bot such as https://streamer.bot/ with websockets.
This is for speedrunners who want to flex a bit more of creativity when it comes to their layouts, along with those who wish to have a tie-in between their speedrun and their OBS.

## Table of Contents

- [Speedrun-Tracker](#Speedrun-Tracker)
  - [Table of Contents](#table-of-contents)
  - [Prerequsites](#prerequsites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Acknowledgements](#acknowledgements)

## Prerequsites

- You must have an account at TheRunGG ( https://therun.gg/ )
  - Livesplit component and steps can be found here: ( https://therun.gg/upload-key )

## Installation

This is just a straight up html file with javascript, so the installation is as simple as downloading the three files (html, js, css).
  - Once downloaded, you'll need to go into the script.js and change your username at line 5 (case sensitive) and SB websocket on line 8 
  - For actions within Streamer.bot you will need to find any "streamerBotSocket.send" lines and correct them to the actions you want to perform
    - "id": Right click actions in Streamer.bot to copy action ID
    - "name" Name will have to be the same as well
    - "id": Anything you want it to be number wise

## Usage

In OBS, set up a browser source where you read a local file, and set it to the saved html file
  - Now you can see that whenever you split, you will see the splits show up as you go along!
  
## Acknowledgements

I started making this project really for myself to make things a bit different on my stream, but as expressed interest caught on, I'd just like to thank you all so much for really motivating me for this since I would have likely done a mediocre job really and with your support, really helped me go above and beyond.
  - Joey from TheRunGG for creating such a wonderful website; please go support that GIGACHAD
  - Nate from Streamerbot, I've fallen in love with Streamerbot and all the features it has; I really appreciate your service
  - YOU, for even considering checking out this repository/project.
