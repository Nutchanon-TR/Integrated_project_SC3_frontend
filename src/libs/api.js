async function getAllData(url) {
    try{
        const data = await fetch(url);
        const finalData = await data.json();
        return finalData;
    }catch(error){
        throw new Error('Cannot get your data');
    }
}

async function getDataById(url, id) {
    try{
        const data = await fetch(`${url}/${id}`);
        if (data.status === 404) return undefined;
        const finalData = await data.json();
        return finalData
    }catch(error){
        throw new Error('Cannot get your data by ID')
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