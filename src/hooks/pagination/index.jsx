import { useEffect, useState } from "react";

export function usePagination(props) {
    const { fetchingAPIInstance, propToGetItem, propToGetTotalPage, amountPerPage = 10, startingPage = 0, totalPages, deps = []} = props;
    // min page : 1, max page : inifinite
    const [currentPage, setCurrentPage] = useState(startingPage);
    const [perPageAmount, setPerPageAmount] = useState(amountPerPage);
    const [total, setTotal] = useState(totalPages);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [resultNumber, setResultNumber] = useState(0);

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
                setResultNumber(response?.data?.[propToGetTotalPage]);
            }
        }).catch(error =>{
            setError(error?.message || "");
        }).finally(() =>{
            setLoading(false);
        });

    }, [currentPage, propToGetTotalPage, ...deps]);

    useEffect(() => {
        if(resultNumber){
            const total = Math.ceil(resultNumber / perPageAmount);
            setTotal(total);
        }
    }, [props, resultNumber]);

    function nextPage(){
        setCurrentPage(c => total < 1 ? 1 : c > total - 1 ? 1 : c + 1);
    }

    function prevPage(){
        setCurrentPage(c => total < 1 ? 1 : c < total + 1 ? totalPages : c - 1);
    }

    function refresh(){
        setLoading(true);
        fetchingAPIInstance.then(response =>{
            if(Array.isArray(response?.data)){
                setItems(response?.data);
            }
            else if (Array.isArray(response?.data?.[propToGetItem])){
                setItems(response.data[propToGetItem]);
            }

            if(propToGetTotalPage){
                setResultNumber(response?.data?.[propToGetTotalPage]);
            }
        }).catch(error =>{
            setError(error?.message || "");
        }).finally(() =>{
            setLoading(false);
        });
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
        refresh
    }
}