import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Col, Row } from 'antd';



const App: React.FC = () => {
  const [diskValues, setdiskValues] = useState<any[]>([]);

  const getData = () => {
    fetch("/get-disk-data")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            setdiskValues(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setdiskValues([])
          }
        )
  }
  useEffect(() => {
    getData()
    
  }, []);
 
  return <Row>
    <Col span={8}>{diskValues.map(x => <p>Disk Label: {x.label}, Name: {x.name !== "" ? x.name : "Local Drive"}, Remaining Space: {x.disk_size_info.available_space_gb}gb/{x.disk_size_info.total_space_gb}gb, Disk Type: {x.disk_type}</p>)}</Col>
    <Col span={8}>col-8</Col>
    <Col span={8}>col-8</Col>
  </Row>
}






export default App
