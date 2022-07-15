import { Col, Row } from "antd";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

export enum MenuEvent {
    View = "View",
    Update = "Update",
    Delete = "Delete"
}
interface MenuEventHandler {
    targetId: string;
    options: MenuEvent[];
    classes: {
        listWrapper: string;
        listItem: string;
    }
}

const ContextEventMenu: React.FC<MenuEventHandler> = ({ ...props }) => {
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const contextRef: any = useRef(null);

    useEffect(() => {
        const contextMenuEventHandler = (event: any) => {
            const targetElement = document.getElementById(props.targetId)
            if (targetElement && targetElement.contains(event.target)) {
                event.preventDefault();
                setContextData({ visible: true, posX: event.clientX, posY: event.clientY })
            } else if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({ ...contextData, visible: false })
            }
        }

        const offClickHandler = (event: any) => {
            if (contextRef.current && !contextRef.current.contains(event.target)) {
                setContextData({ ...contextData, visible: false })
            }
        }

        document.addEventListener('contextmenu', contextMenuEventHandler)
        document.addEventListener('click', offClickHandler)
        return () => {
            document.removeEventListener('contextmenu', contextMenuEventHandler)
            document.removeEventListener('click', offClickHandler)
        }
    }, [contextData, props.targetId])

    useLayoutEffect(() => {
        if (contextData.posX + contextRef.current?.offsetWidth > window.innerWidth) {
            setContextData({ ...contextData, posX: contextData.posX - contextRef.current?.offsetWidth })
        }
        if (contextData.posY + contextRef.current?.offsetHeight > window.innerHeight) {
            setContextData({ ...contextData, posY: contextData.posY - contextRef.current?.offsetHeight })
        }
    }, [contextData])

    return (
        <Row>
            <Col>
                <div ref={contextRef} className='contextMenu' style={{ display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
                    <div className={`optionsList ${props.classes?.listWrapper}`}>
                        {props.options.map((option) => (
                            <li key={option} className={`optionListItem ${props.classes?.listItem}`}>
                                {option}
                            </li>
                        ))}
                    </div>
                </div>
            </Col>
        </Row>

    );
}

export default ContextEventMenu;