import { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Col, Progress, Row } from 'antd';
import { DiskInfo } from './bindings/disk';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  const [diskValues, setdiskValues] = useState<DiskInfo[]>([]);

  const calculateTotalUsedPercentage = (total: number, free: number) => {
    let used: number = total - free;
    let usedPercentage: number = (used / total) * 100;
    return Math.round(usedPercentage);
  }

  const getData = () => {
    fetch("/get-disk-data")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          setdiskValues(result);
        },
        (error) => {
          setdiskValues([])
        }
      )
  }
  useEffect(() => {
    getData()

  }, []);

  return <Row>
    {diskValues.map(x =>{ 
      const usedPercentage: number = calculateTotalUsedPercentage(x.disk_size_info.total_space_gb, x.disk_size_info.available_space_gb);
      return <Col span={6}>
      <Row>
        <Col span={12}>
          <h3>Disk Info</h3>
          <p>Disk Label: {x.label}<br></br> Name: {x.name !== "" ? x.name : "Local Drive"}<br></br>
          Remaining Space: {x.disk_size_info.available_space_gb}gb/{x.disk_size_info.total_space_gb}gb <br></br> Disk Type: {x.disk_type}<br></br></p>
        </Col>

        <Col span={12}>
          <h3>Percent Used</h3>
        <Progress type="circle"
          strokeColor={usedPercentage > 75 ? "red" : usedPercentage >= 50 ? "#d4b402" : "green"}
          percent={usedPercentage} />
      
        </Col>
      </Row>
    </Col>
  })}
  </Row>

}

export default App
