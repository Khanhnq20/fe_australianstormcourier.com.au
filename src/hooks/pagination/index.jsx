import { useEffect, useState } from "react";

export function usePagination(props) {
    const { fetchingAPIInstance, propToGetItem, propToGetTotalPage, amountPerPage = 10, startingPage = 1, totalPages = 1} = props;
    // min page : 1, max page : inifinite
    const [currentPage, setCurrentPage] = useState(startingPage);
    const [perPageAmount, setPerPageAmount] = useState(amountPerPage);
    const [total, setTotal] = useState(totalPages);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetchingAPIInstance.then(response =>{
            if(Array.isArray(response?.data)){
                setItems(response?.data);
            }
            else if (Array.isArray(response?.data?.[propToGetItem])){
                setItems(response.data[propToGetItem]);
            }

            if(propToGetTotalPage){
                setTotal(response?.data?.[propToGetTotalPage]);
            }
        }).catch(error =>{
            setError(error?.message || "");
        }).finally(() =>{
            setLoading(false);
        });

    }, [currentPage]);

    useEffect(() => {
        setTotal(totalPages);
    }, [props]);

    function nextPage(){
        setCurrentPage(c => total < 1 ? 1 : c > total - 1 ? 1 : c + 1);
    }

    function prevPage(){
        setCurrentPage(c => total < 1 ? 1 : c < total + 1 ? totalPages : c - 1);
    }


    return {
        currentPage,
        perPageAmount,
        total,
        loading,
        error,
        items,
        nextPage,
        prevPage,
        setCurrent: setCurrentPage,
        setPerPageAmount,
    }
}