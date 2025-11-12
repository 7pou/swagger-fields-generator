const request = ({url, ...options}): Promise<Response> => {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((response) => {

            if (response.ok) {
                resolve(response)
            } else {
                reject(response)
            }
        }).catch((error) => {
            reject(error)
        })
    })
}
export default request
