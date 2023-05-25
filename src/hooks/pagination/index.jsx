import { useEffect, useRef, useState } from "react";

export function usePagination({ 
    fetchingAPIInstance, 
    propToGetItem, 
    propToGetTotalPage, 
    amountPerPage = 10, 
    startingPage = 1, 
    totalPages = 1, 
    deps = []
}) {

    // min page : 1, max page : inifinite
    const [currentPage, setCurrentPage] = useState(startingPage);
    const [perPageAmount, setPerPageAmount] = useState(amountPerPage);
    const [total, setTotal] = useState(totalPages);
    const controller = new AbortController();

    // productions
    const [items, setItems] = useState([]);
    const [resultNumber, setResultNumber] = useState(0);

    // internal status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchingAPIInstance({
            controller,
            page: currentPage, 
            take: perPageAmount,
        }).then(response =>{
            if (!!propToGetItem && Array.isArray(response?.data?.[propToGetItem])){
                setItems(response.data[propToGetItem]);
            }

            else if(Array.isArray(response?.data)){
                setItems(response?.data);
            }

            if(propToGetTotalPage){
                setResultNumber(response?.data?.[propToGetTotalPage]);
            }

            setLoading(false);
        }).catch(error =>{
            setError(error?.message || "");
            setLoading(false);
        });

        return () =>{
            controller.abort();
        }
    }, [currentPage, perPageAmount]);

    useEffect(() => {
        if(resultNumber){
            const total = Math.ceil(resultNumber / perPageAmount);
            if(currentPage > total){
                setCurrentPage(total);
            }
            setTotal(total);
        }
    }, [resultNumber, perPageAmount]);

    useEffect(() =>{
        if(currentPage < 1){
            setCurrentPage(1);
        }

        else if(currentPage > total){
            setCurrentPage(total);
        }
    }, [currentPage]);
    
    function nextPage(){
        setCurrentPage(c => total < 1 ? 1 : c > total - 1 ? 1 : c + 1);
    }

    function prevPage(){
        setCurrentPage(c => total < 1 ? 1 : c < total + 1 ? totalPages : c - 1);
    }

    function refresh(){
        setLoading(true);
        fetchingAPIInstance({
            controller,
            page: currentPage, 
            take: perPageAmount
        }).then(response =>{
            if(Array.isArray(response?.data)){
                setItems(response?.data);
            }
            else if (Array.isArray(response?.data?.[propToGetItem])){
                setItems(response.data[propToGetItem]);
            }

            if(propToGetTotalPage){
                setResultNumber(response?.data?.[propToGetTotalPage]);
            }

            setLoading(false);
        }).catch(error =>{
            setError(error?.message || "");
            setLoading(false);
        });
    }

    function search(queries) {
        if(fetchingAPIInstance && !Array.isArray(queries) && typeof queries === "object"){
            setLoading(true);
            fetchingAPIInstance({
                controller,
                page: currentPage, 
                take: perPageAmount,
                ...queries
            }).then(response =>{
                if (!!propToGetItem && Array.isArray(response?.data?.[propToGetItem])){
                    setItems(response.data[propToGetItem]);
                }
    
                else if(Array.isArray(response?.data)){
                    setItems(response?.data);
                }
    
                if(propToGetTotalPage){
                    setResultNumber(response?.data?.[propToGetTotalPage]);
                }
    
                setLoading(false);
            }).catch(error =>{
                setError(error?.message || "");
                setLoading(false);
            });
    
            return () =>{
                controller.abort();
            }
        }
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
        refresh,
        search
    }
}