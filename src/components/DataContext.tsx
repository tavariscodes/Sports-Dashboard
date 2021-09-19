import React, {useContext, useState} from 'react';

const DataContext = React.createContext<null | any>(null);
const DataUpdateContext = React.createContext<((data: object) => void) | null>(null);

export const useData = () => {
    return useContext(DataContext)
}

export const useUpdateData = () => {
    return useContext(DataUpdateContext)
}

interface DataProviderProps {
    data: object | null,
    setData: React.Dispatch<object | null>,
    children: JSX.Element
}

export const DataProvider: React.FC<DataProviderProps> = ({children, data, setData}) => {
    // const [dataToRender, setDataToRender] = useState<object>({test: 'successful'})

    const updateData = (data: object) => {
        setData(data)
    }
    return(
        <DataContext.Provider value={data}>
            <DataUpdateContext.Provider value={updateData}>
                {children}
            </DataUpdateContext.Provider>
        </DataContext.Provider>
    )
}