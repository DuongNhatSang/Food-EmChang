'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import '@/styles/food.css';
import { db } from '../../../public/firebaseConfig';
import { doc, setDoc, getDocs, collection, query } from "firebase/firestore"; 
import { useRouter } from 'next/navigation';


const SalePage = () => {  
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  const [food, setFood] = useState<Food>({
    id: '1',
    treTron: true,
    nemnuong: true,
    chaNuong: true,
    chanvit: true,
    changa: true,
    tratac: true,
    topda: true,
    suidin: true,
    banhDauBo: true
  });
  const [noti, setNoti] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 200);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = query(collection(db, "food"));
        const querySnapshot = await getDocs(usersRef);

        querySnapshot.forEach((doc) => {
          const fetchFood: Food = {
            id: doc.id,
            treTron: doc.data().treTron,
            nemnuong: doc.data().nemnuong,
            chaNuong: doc.data().chaNuong,
            chanvit: doc.data().chanvit,
            changa: doc.data().changa,
            tratac: doc.data().tratac,
            topda: doc.data().topda,
            suidin: doc.data().suidin,
            banhDauBo: doc.data().banhDauBo
          };
          console.log(fetchFood);
          setFood(fetchFood);
          console.log(food);
        });

      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = query(collection(db, "notication"));
        const querySnapshot = await getDocs(usersRef);

        querySnapshot.forEach((doc) => {
          setNoti(doc.data().noti)
        });

      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };
    fetchData();
  }, []);


  const router = useRouter();

  const [formData, setFormData] = useState<UserInformation>({
    id: "0",
    treTronX: 0,
    treTronM: 0,
    treTronL: 0,
    nemnuong: 0,
    chaNuong: 0,
    chanvit: 0,
    changa: 0,
    tratac: 0,
    topda: 0,
    suidin: 0,
    banhDauBo: 0,
    name: '',
    address: '',
    phone: '',
    note:'',
    now: '',
    check: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function generateRandomNumber(): string {
    let randomNumber = '';
    for (let i = 0; i < 10; i++) {
      randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
  }

  const handleIncrement = (field: keyof UserInformation) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (Number(prev[field]) || 0) + 1,
    }));
  };

  const handleDecrement = (field: keyof UserInformation) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (Number(prev[field]) || 0) > 0 ? (Number(prev[field]) || 0) - 1 : 0,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function formatDateTime (date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are 0-based in JavaScript
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const currentDateTime = formatDateTime(new Date());
    console.log(currentDateTime);
    try {
      await setDoc(doc(db, "customer", generateRandomNumber()), {
        treTronX: formData.treTronX,
        treTronM: formData.treTronM,
        treTronL: formData.treTronL,
        nemnuong: formData.nemnuong,
        chaNuong: formData.chaNuong,
        chanvit: formData.chanvit,
        changa: formData.changa,
        tratac: formData.tratac,
        topda: formData.topda,
        suidin: formData.suidin,
        banhDauBo: formData.banhDauBo,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        note: formData.note,
        now: currentDateTime,
        check: formData.check,
      });
      router.push('/thank-you');
    } catch (error) {
      console.error("Error submitting form: ", error);
      setIsSubmitting(false); // Allow retry in case of an error
    }
  };



  return (
    <Container fluid style={{ backgroundImage: `url("/images/6_1_n.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', padding: '2rem' }}>
      <div className="header text-center">
        <Image src="/images/anhbia.png" fluid className="w-100"/>
      </div>
      <div className="body">
        <Row className="mt-5">
          <Col xs={3}></Col>
          <Col xs={6} className="text-center">
            <h3 style={{ color: colors[colorIndex] }}>{noti}</h3>
          </Col>
          <Col xs={3}></Col>
        </Row>
        <Row className="mt-5">
          <Col xs={3}></Col>
          <Col xs={6} className="text-center">
            <h1>Menu</h1>
          </Col>
          <Col xs={3}></Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/1_n.jpg" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body  className="text-center">
                <Card.Title>Tré trộn</Card.Title>
                <Card.Text>
                  <h5>Size S-M-L: 50k-75k-100k {food.treTron === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/chanvit1.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Chân vịt rút xương sốt Thái must try</Card.Title>
                <Card.Text>
                  <h5>70k/Phần {food.chanvit === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/chanuong.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Chả nướng ống tre Huế</Card.Title>
                <Card.Text>
                  <h5>55k/Phần {food.chaNuong === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/4_n.jpg" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Bánh sừng bò</Card.Title>
                <Card.Text>
                  <h5>45k/2 Bánh mix vị {food.banhDauBo === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row className="justify-content-center mt-4">
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/topda.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Tóp da Huế</Card.Title>
                <Card.Text>
                  <h5>25k/Phần {food.topda === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/changa.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Chân gà rút xương sốt Thái</Card.Title>
                <Card.Text>
                  <h5>60k/Phần {food.changa === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/nemgan.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Nem gân Huế nướng</Card.Title>
                <Card.Text>
                  <h5>70k/Phần {food.nemnuong === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/suidin.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body  className="text-center">
                <Card.Title>Sủi dìn {food.suidin === false && <span style={{ color: 'red' }}>(Hết món)</span>}</Card.Title>
                <Card.Text>
                  <h5>65k/10 Viên</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row className="justify-content-center mt-4">
          <Col xs={12} sm={6} md={4} lg={3}>
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src="/images/nuoc.png" style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body className="text-center">
                <Card.Title>Trà tắc thái xanh</Card.Title>
                <Card.Text>
                  <h5>20k/Ly {food.tratac === false && <span style={{ color: 'red' }}>(Hết món)</span>}</h5>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>


        <Row className="mt-5">
          <Col xs={3}></Col>
          <Col xs={6}>
            <h1 className="text-center">Chọn số lượng và thông tin địa chỉ</h1>
            <Form onSubmit={handleSubmit}>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4} className="fw-bold fs-5">
                  Tré trộn:
                </Form.Label>
                <Col sm={8}>
                  <Row className="d-flex justify-content-between">
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                      <Form.Label className="fw-bold fs-6">Size S</Form.Label>
                      <InputGroup>
                        <Button variant="success" onClick={() => handleDecrement('treTronX')}>-</Button>
                        <Form.Control
                          type="number"
                          name="treTronX"
                          min="0"
                          value={formData.treTronX}
                          onChange={handleInputChange}
                          readOnly
                          style={{ textAlign: 'center', maxWidth: '70px' }}
                        />
                        <Button variant="success" onClick={() => handleIncrement('treTronX')}>+</Button>
                      </InputGroup>
                    </Col>
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                      <Form.Label className="fw-bold fs-6">Size M</Form.Label>
                      <InputGroup>
                        <Button variant="success" onClick={() => handleDecrement('treTronM')}>-</Button>
                        <Form.Control
                          type="number"
                          name="treTronM"
                          min="0"
                          value={formData.treTronM}
                          onChange={handleInputChange}
                          readOnly
                          style={{ textAlign: 'center', maxWidth: '70px' }}
                        />
                        <Button variant="success" onClick={() => handleIncrement('treTronM')}>+</Button>
                      </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Label className="fw-bold fs-6">Size L</Form.Label>
                      <InputGroup>
                        <Button variant="success" onClick={() => handleDecrement('treTronL')}>-</Button>
                        <Form.Control
                          type="number"
                          name="treTronL"
                          min="0"
                          value={formData.treTronL}
                          onChange={handleInputChange}
                          readOnly
                          style={{ textAlign: 'center', maxWidth: '70px' }}
                        />
                        <Button variant="success" onClick={() => handleIncrement('treTronL')}>+</Button>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </Form.Group>

              {['chanvit', 'chaNuong', 'banhDauBo', 'topda', 'changa', 'nemnuong', 'suidin', 'tratac'].map((item) => (
                <Form.Group as={Row} className="mb-3" key={item}>
                  <Form.Label column sm={4} className="fw-bold fs-5">
                    {item === 'chanvit'
                      ? 'Chân vịt rút xương sốt Thái:'
                      : item === 'chaNuong'
                      ? 'Chả nướng ống tre Huế:'
                      : item === 'banhDauBo'
                      ? 'Bánh sừng bò:'
                      : item === 'topda'
                      ? 'Tóp da Huế:'
                      : item === 'changa'
                      ? 'Chân gà rút xương sốt Thái:'
                      : item === 'nemnuong'
                      ? 'Nem gân Huế nướng:'
                      : item === 'suidin'
                      ? 'Sủi dìn:'
                      : 'Trà tắc thái xanh:'}
                  </Form.Label>
                  <Col sm={8}>
                    <InputGroup>
                      <Button variant="success" onClick={() => handleDecrement(item as keyof UserInformation)} disabled={!food[item as keyof Food]}>
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        name={item}
                        min="0"
                        value={formData[item as keyof UserInformation]}
                        onChange={handleInputChange}
                        readOnly
                        style={{ textAlign: 'center', maxWidth: '70px' }}
                      />
                      <Button variant="success" onClick={() => handleIncrement(item as keyof UserInformation)} disabled={!food[item as keyof Food]}>
                        +
                      </Button>
                    </InputGroup>
                  </Col>
                </Form.Group>
              ))}
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4} className="fw-bold fs-5">
                  Tên
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4} className="fw-bold fs-5">
                  Địa chỉ
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4} className="fw-bold fs-5">
                  Số điện thoại
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={4} className="fw-bold fs-5">
                  Ghi chú cho quán
                </Form.Label>
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm={{ span: 8, offset: 4 }}>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Đặt hàng
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col xs={3}></Col>
        </Row>
      </div>
    </Container>
  );
};

export default SalePage;
