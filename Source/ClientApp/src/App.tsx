import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Col, Progress, Row } from 'antd';
import { DiskInfo } from './bindings/disk';
import 'antd/dist/antd.css';
import React from 'react';
import DiskInfoGeneric from './components/DiskInfo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const DiskContext = React.createContext<DiskInfo[]>([]);

const App: React.FC = () => {
  const [diskValues, setdiskValues] = useState<DiskInfo[]>([]);

  const getData = () => {
    fetch("http://localhost:9876/get-disk-data")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setdiskValues(result);
        },
        (error) => {
          console.log(error);
          setdiskValues([])
        }
      )
  }
  useEffect(() => {
    getData()

  }, []);

  return <DiskContext.Provider value={diskValues}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiskInfoGeneric />} />
      </Routes>
    </BrowserRouter>
  </DiskContext.Provider>

}

export default App
