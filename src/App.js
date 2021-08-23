import { useRef, useState } from 'react';
import { Button, Container, Form, Modal, Nav } from 'react-bootstrap'

export default function App() {
    // State Management for the Application & ref for Input monitoring
    const [mode, setMode] = useState("NA")
    const [cycl, setCycl] = useState(1)
    const [time, setTime] = useState({ min: 0, sec: 0 })
    const [intv, setIntv] = useState()
    const [stat, setStat] = useState(0)
    const [show, setShow] = useState(false);
    const InputRef = useRef()

    // Temporary functional vairiables
    var updatedCycl = cycl, updatedMode = mode, updatedMin = time.min, updatedSec = time.sec
    
    // Clock counting method used for timer
    const run = () => {
        updatedSec++
        if(updatedMode === "NA" && updatedCycl > 0) {
            updatedMode = "WORK"
            setMode("WORK")
        }
        if(updatedSec === 60) {
            updatedMin++
            updatedSec = 0
        }
        if(updatedMin === 24 && updatedSec === 59 && updatedMode === "WORK") {
            document.getElementById('stop').click()
            document.getElementById('rset').click()
            updatedMode = "BREAK"
            setMode("BREAK")
            updatedCycl--
            setCycl(updatedCycl)
            document.getElementById('star').click()   
        } else if(updatedMin === 4 && updatedSec === 59 && updatedMode === "BREAK" && updatedCycl > 0) {
            document.getElementById('stop').click()
            document.getElementById('rset').click()
            updatedMode = "WORK"
            setMode("WORK")
            document.getElementById('star').click()
        } else if(updatedMin === 5 && updatedSec === 0 && updatedMode === "BREAK") {
            document.getElementById('stop').click()
            updatedMin = 0
            updatedSec = 0
            updatedMode = "NA"
            setMode("NA")
        }

        setTime({ min: updatedMin, sec: updatedSec })
    }

    // Start event Handler
    const start = (e) => {
        if(cycl === 0) setCycl(1)
        e.preventDefault();
        if(!stat) {
            setIntv(setInterval(run, 1000))
            setStat(1) 
        }
    }

    // Stop event Handler
    const stop = (e) => {
        e.preventDefault();
        if(stat) {
            clearInterval(intv)
            setStat(0)
            setMode("NA")
        }
    }

    // Reset event Handler
    const reset = (e) => {
        e.preventDefault();
        setTime({ min: 0, sec: 0 })
        updatedMin = 0
        updatedSec = 0
    }

    // Modal Event Handlers
    const handleClose = () => {
        setShow(false);
        setCycl(InputRef.current.value)
    }
    const handleShow = () => setShow(true);

    // Navbar elements for mode indicator
    const work = (
        <Nav variant="pills">
            <Nav.Item>
                <Nav.Link id="work" eventKey="WORK" active disabled>Work</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link id="work" eventKey="BREAK" disabled>Break</Nav.Link>
            </Nav.Item>
        </Nav>
    )
    const brek = (
        <Nav variant="pills">
            <Nav.Item>
                <Nav.Link id="work" eventKey="WORK" disabled>Work</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link id="work" eventKey="BREAK" active disabled>Break</Nav.Link>
            </Nav.Item>
        </Nav>
    )
    const na = (
        <Nav variant="pills">
            <Nav.Item>
                <Nav.Link id="work" eventKey="WORK" disabled>Work</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link id="work" eventKey="BREAK" disabled>Break</Nav.Link>
            </Nav.Item>
        </Nav>
    )

    // Mode indicator
    const navhead = (mode) => {
        if(mode === "WORK") return work
        else if(mode === "BREAK") return brek
        else return na
    }

    return (
        <>
            <Container className="main">
                {navhead(mode)}
                <Button variant="outline-secondary" onClick={handleShow} size="sm">Settings</Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Enter number of intervals</Form.Label>
                                <Form.Control type="number" placeholder="Enter integer value" ref={InputRef} required />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            <Container id="timer">
                <h1>{(time.min < 10) ? '0' + time.min : time.min}:{(time.sec < 10) ? '0' + time.sec : time.sec}</h1>
                <h6>timer</h6>
                <span>
                    <Button id="star" variant="outline-secondary" size="sm" onClick={e => start(e)}>Start</Button>
                    <Button id="stop" variant="outline-secondary" size="sm" onClick={e => stop(e)}>Stop</Button>
                    <Button id="rset" variant="outline-secondary" size="sm" onClick={e => reset(e)}>Reset</Button>
                </span>
            </Container>
            <Container className="main">
                <h2>Pomodoro Timer</h2>
            </Container>
        </>
    )
}
