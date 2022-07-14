import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Col, Row } from 'antd';



const App: React.FC = () => {
  const [diskValues, setdiskValues] = useState("");
  useEffect(() => {
      fetch("/get-disk-data")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result.data);
            setdiskValues(result.data);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setdiskValues("")
          }
        )
    
  });
 
  return <Row>
    <Col span={8}>{diskValues}</Col>
    <Col span={8}>col-8</Col>
    <Col span={8}>col-8</Col>
  </Row>
}






export default App
