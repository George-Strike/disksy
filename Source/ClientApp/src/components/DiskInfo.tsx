import { useContext, useEffect, useState } from 'react'
import { Button, Col, Progress, Row } from 'antd';
import { DiskInfo } from '../bindings/disk';
import React from 'react';
import { DiskContext } from '../App';
import Search from 'antd/lib/input/Search';
import Directory from './Directory';


const DiskInfoGeneric: React.FC = () => {
  const diskValues: DiskInfo[] = useContext(DiskContext);
  const [showDirectory, setShowDirectory] = useState<boolean>(false);
  const [directoryPath, setDirectoryPath] = useState<string>("");


  const calculateTotalUsedPercentage = (total: number, free: number) => {
    let used: number = total - free;
    let usedPercentage: number = (used / total) * 100;
    return Math.round(usedPercentage);
  }

  const onSearch = (value: string) => {
    console.log(value)
      setDirectoryPath(value);
      setShowDirectory(true);
  };
  const onClick = () => {
      setShowDirectory(false);
  };

  return <div><Row>
    {diskValues.map(x => {
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
    <Row>
      <Col span={24}>
        <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          style={{ paddingTop: "2.5em", paddingBottom: "2em" }}
        />
        <Button type="primary" size={"large"} onClick={onClick}>
          Reset
        </Button>
      </Col>


      {showDirectory ? <Col span={24}>
        <Directory directoryPath={directoryPath} />
      </Col> : null}
    </Row>
  </div>
}

export default DiskInfoGeneric;