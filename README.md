# Hackathon Search service

## System Requirements

1. Docker image of Elasticsearch:

`docker pull docker.elastic.co/elasticsearch/elasticsearch:7.10.2`

2. Node / npm (nodejs.org)

3. Health Cloud VPN

## Setup

1. Start an Elasticsearch Docker container and wait for it to finish initializing

`docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.10.2`

- You'll know it's set up when you can see a response from http://localhost:9200

2. Get a token from the Identity Broker Test App -- the example below uses the DEV environment

- (https://identity-broker-test.testportal.general.dev.hci.aetna.com > CKD Login)
- DMT-S-W185131592 | Aetna2aetna

3. Paste the id token into the config/default.js file and SAVE.

4. Verify that the urls in the config are using the same environment you retrieved the token from.

5. Install dependencies

`npm install`

6. Run the script to index Elasticsearch (if you waited longer than 5 minutes, you'll have to get a new token in DEV or TEST).

`node scripts/index-elasticsearch.js`

* You will probably get an error message or two because of some junk data in lower environments. Don't worry about it - we'll just skip those cards.

7. Start the service

`node src/index.js`

8. The service has one endpoint besides the healthcheck endpoint:

#### Examples:
`curl --location --request GET 'localhost:3000/search?q=power'`

`curl --location --request GET 'localhost:3000/search?q=yogurt&mealType=breakfast&offset=0&count=25'`
