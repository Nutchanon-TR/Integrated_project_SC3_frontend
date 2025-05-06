async function getAllData(url) {
    try{
        const data = await fetch(url);
        if (data.status === 404) return undefined;
        const finalData = await data.json();
        return finalData;
    }catch(error){
        throw new Error(error);
    }
}

async function getDataById(url, id) {
    try{
        const data = await fetch(`${url}/${id}`);
        if (data.status === 404) return undefined;
        const finalData = await data.json();
        return finalData
    }catch(error){
        throw new Error(error)
    }
}

export {
    getAllData,
    getDataById,
    // addData,
    // updateData,
    // updateSomeData,
    // deleteUserById,
  };