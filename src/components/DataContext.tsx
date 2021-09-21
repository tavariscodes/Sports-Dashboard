import React, {useContext, useState, useMemo} from 'react';

const DataContext = React.createContext<{data: any;
    setData: React.Dispatch<any>;
    query: string | null;
    setQuery: React.Dispatch<string | null>
    option: string | null;
    setOption: React.Dispatch<string | null>
}>(({
        data: {},
        setData: () => {},
        query: null,
        setQuery: () => {},
        option: null,
        setOption: () => {}
    }));
const DataUpdateContext = React.createContext<((data: object) => void) | null>(null);

export const useData = () => {
    return useContext(DataContext)
}

export const useUpdateData = () => {
    return useContext(DataUpdateContext)
}

interface DataProviderProps {
    data: object | any,
    setData: React.Dispatch<object | any>,
    query: string | null,
    setQuery: React.Dispatch<string | null>,
    option: string | null,
    setOption: React.Dispatch<string | null>,
    children: JSX.Element,
}

export const DataProvider: React.FC<DataProviderProps> = ({children, data, setData, query, setQuery, option, setOption}) => {
    // const [dataToRender, setDataToRender] = useState<object>({test: 'successful'})
    const value = useMemo(
        () => ({ 
            data, setData,
            query, setQuery,
            option, setOption
        }),
        [data, query, option]
    );

    const updateData = (data: object | any) => {
        setData(data)
    }
    return(
        <DataContext.Provider value={value}>
                {children}
        </DataContext.Provider>
    )
}