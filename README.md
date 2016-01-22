# VIP ID

An app that enables you to prove who you are without revealing personal information. Inspired by [The Basics Of A Bitcoin-Based Global Identity System](https://www.youtube.com/watch?v=xZC98s4paYY).

[Live demo](http://vipid.herokuapp.com)

[Screencast](https://www.youtube.com/watch?v=xMw3G5GuE5o&feature=youtu.be)

[Diagram](http://vipid.herokuapp.com/images/blockchain_vertical-dia.jpg)

## Use case

An NGO enables staff in conflict zones to prove their affiliation without showing documentation.

## Flow
###### NGO 
- Takes photo of staff, hashes document with sha256 (creating a digital fingerprint of doc), and pays minimum transaction from its public address to an address generated from the hash.
- Sends image to staff member

###### Staff 
- Uploads image to one or multiple online locations.
- Creates customized bitly links with mnemonics to image locations.
- When in trouble, finds person of authority with this app, and provides mnemonic.

###### App user
- Enters mnemonic into app.
- Confirms whether the image that is returned matches staff person. 

## Setup and Configuration
- bower install
- Change config_example.js to config.js
- Set bitly [token](http://dev.bitly.com)
- Create string containing "PUBLIC_ADDRESS1:ORG1, PUBLIC_ADDRESS1:ORG2"

(With no way to publically register a bitcoin address, verifying the owner of an address will take place on the server.)


## Document conversion

To convert an image to a bitcoin public address:

- Add image file to document folder.
- run: node create_public_address_from_image.js

Output: "Public address for image: 1c2oRatBPCkTUeL9Un9rQwrmwgJempLKk"


## Secure image on the blockchain

- Send minimum transaction amount from PUBLIC_ADDRESS1 to public address of image

(This app queries blockchain.info)


