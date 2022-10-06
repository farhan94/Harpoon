# Harpoon
Catching fish in the open sea.

## What is Harpoon?
This is an outdated Chrome extension I created that added a quick buy button for NFTs on OpenSea. I created this for an NFT Discord group I was in, and it required users to authenticate through Discord, which would then call an AWS API Gateway endpoint, which would in turn trigger a Lambda function to determine whether or not the user was in the requisite Discord server. **Do note that the api endpoint for auth has been taken down, though the discord portion of the auth is still active.**

When a valid user clicked the quick buy button, the extension would force the browser to run through the buy prompts on OpenSea and quickly get to the point where it would create the transaction in your web3 wallet. The user would then complete the transaction as normal in their wallet. This worked great in the early days of NFTs, but now there are better tools out there that can snipe listings quicker.

OpenSea website updates have also made this extension's functionality cease working as intended. I am making this repo public in case anyone was ever curious for how it worked.
