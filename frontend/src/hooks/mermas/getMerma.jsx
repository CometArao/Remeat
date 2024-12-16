//TODO: get mermas

import { useEffect, useState } from "react";
import { getmerma } from "@services/merma.service.js"

const useMerma = (id) => {
    const [merma, setMerma] = useState([])
    const fetchMerma = async (id) => {
        try {
            const mermaEncontrada = await getmerma(id);
            console.log("mermaEncontrada")
            console.log(mermaEncontrada)
            setMerma(mermaEncontrada)
        }catch(error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchMerma();
    }, [])
    return {merma, fetchMerma, setMerma}
}

export default useMerma