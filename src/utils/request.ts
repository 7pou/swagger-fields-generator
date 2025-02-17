const request = (options) => {
    return new Promise((resolve, reject) => {
        fetch(options.url, options).then((response) => {
            if (response.ok) {
                resolve(response.json()) 
            } else {
                reject(response)
            }
        }).then((data) => {
            reject(data)
        })
    })
}
export default request