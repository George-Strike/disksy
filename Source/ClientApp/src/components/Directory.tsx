import { useContext, useEffect, useState } from 'react'
import { Col, Progress, Row } from 'antd';
import { DiskInfo } from '../bindings/disk';
import React from 'react';
import { DiskContext } from '../App';
import { DirectoryInfo } from '../bindings/directory';


const Directory: React.FC<{directoryPath: string}> = ({directoryPath}) => {
    const [directoryValues, setDirectoryValues] = useState<DirectoryInfo>();

    const getData = () => {
        fetch(`http://localhost:9876/directory/${directoryPath}`)
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result);
              setDirectoryValues(result);
            },
            (error) => {
              console.log(error);
            }
          )
      }

    useEffect(() => {
        getData()
    
      }, []);    


  return <div>
    <Row>
        <Col>
        <p>{directoryValues?.name + "\n"}</p>
        <p>{directoryValues?.path + "\n"}</p>
        <p>{directoryValues?.files ? directoryValues?.files?.toString() + "\n" : null}</p>
        <p>{directoryValues?.size + "\n"}</p>
        </Col>   
    </Row>
  </div>
}

export default Directory;