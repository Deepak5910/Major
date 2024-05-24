const FetchData = async (username, accountAddress, web3) => {
    let signedData;
    window.alert(username);
    await web3.eth.personal.sign(
        username,
        accountAddress,
        (err, signature) => {
            if (err) {
                signedData = err;
            } else {
                signedData = web3.eth.accounts.hashMessage(signature);
            }
        }
    );

    return signedData;
}

export default FetchData;