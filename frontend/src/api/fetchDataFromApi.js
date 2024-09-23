import api from "./api"

export const fetchDataFromApi = async (url, params) => {
  try {
    const response = await api.get(url, {
      withCredentials: true,
    })
    console.log("waht is the error", response)
    console.log("kadddd", response.data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error // Throw error so that it can be caught by the caller
  }
}
