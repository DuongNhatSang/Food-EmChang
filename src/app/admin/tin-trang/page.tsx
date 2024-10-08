
'use client';

import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SetStateAction, useEffect, useState } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../public/firebaseConfig';
import { Changa } from 'next/font/google';

const UserManagement = () => {
  const [userInformations, setuserInformations] = useState<UserInformation[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [noti, setNoti] = useState('');
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
          setFood(fetchFood);
        });
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChangeFood = (key: keyof Food) => {
    setFood((prevFood) => ({
        ...prevFood,
        [key]: !prevFood[key]
    }));
    console.log(food);
  };

  const foodItems = Object.keys(food).filter(key => key !== 'id') as Array<keyof Food>;

  const handleUpdateFood = async () => {
    console.log(food);
    try {
      const docRef = doc(db, "food", "123"); 
      await updateDoc(docRef, { banhDauBo: food.banhDauBo, 
        chaNuong: food.chaNuong, 
        changa: food.changa, 
        chanvit: food.chanvit, 
        nemnuong: food.nemnuong, 
        suidin: food.suidin,
        topda: food.topda,
        tratac: food.tratac,
        treTron: food.treTron });
      alert("Update thành công");
    } catch (error) {
      console.error("Error updating food items: ", error);
      alert("Error updating food items. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = query(collection(db, "customer"));
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers: any[] = [];
  
        querySnapshot.forEach((doc) => {
          const userInformation: UserInformation = {
            id: doc.id,
            treTronX: doc.data().treTronX,
            treTronM: doc.data().treTronM,
            treTronL: doc.data().treTronL,
            nemnuong: doc.data().nemnuong,
            chaNuong: doc.data().chaNuong,
            chanvit: doc.data().chanvit,
            changa: doc.data().changa,
            tratac: doc.data().tratac,
            topda: doc.data().topda,
            suidin: doc.data().suidin,
            banhDauBo: doc.data().banhDauBo,
            name: doc.data().name,
            address: doc.data().address,
            phone: doc.data().phone,
            note:doc.data().note,
            now: doc.data().now,
            check: doc.data().check,
          };
          fetchedUsers.push(userInformation);
        });

        const convertToDate = (str: string) => {
           // Loại bỏ bất kỳ dấu phẩy nào trong chuỗi
          str = str.replace(',', '');

          const [time, day] = str.split(' ');
          const [hours, minutes, seconds] = time.split(':').map(num => num.padStart(2, '0'));
          const [dayPart, monthPart, yearPart] = day.split('/').map(Number);
        
          const year = yearPart;
          const month = monthPart < 10 ? `0${monthPart}` : monthPart;
          const dayOfMonth = dayPart < 10 ? `0${dayPart}` : dayPart;
          const formattedDate = `${year}-${month}-${dayOfMonth}T${hours}:${minutes}:${seconds}`;
          console.log("formattedDate " + formattedDate);
          return new Date(formattedDate);
        };

        // Chuyển đổi now sang đối tượng Date trước khi so sánh
        fetchedUsers.sort((a, b) => {
          const dateA = convertToDate(a.now);
          const dateB = convertToDate(b.now);
          return dateB.getTime() - dateA.getTime();
        });
        setuserInformations(fetchedUsers);
        console.log(userInformations);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUsers = async () => {
    try {
      await Promise.all(selectedUsers.map(id => deleteDoc(doc(db, "customer", id))));
      setuserInformations(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(userId => userId !== id) 
        : [...prevSelected, id]
    );
  };

  const handleCheckChange = async (id: string) => {
    try {
      const userDoc = doc(db, "customer", id);
      await updateDoc(userDoc, { check: 1 });

      setuserInformations(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, check: 1 } : user
        )
      );
    } catch (error) {
      console.error("Error updating check value:", error);
    }
  };

  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setNoti(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const userDoc = doc(db, "notication", "123");
      await updateDoc(userDoc, { noti: noti });
      setNoti(''); // Clear input after submission
      alert("Update thành công!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const thStyle = {
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
  };

    return (
      <Container>
        <Row className="my-4">
          <Col>
            <h1>Cập nhật thông báo</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicInput" className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={noti}
                    onChange={handleChange}
                    className="me-2"
                  />
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="my-4">
            <Col>
                <h1>Cập nhật các món đã hết</h1>
                <Form>
                  <Row>
                    {foodItems.map((item) => (
                        <Col xs={6} md={4} lg={3} key={item} className="mb-2">
                            <Form.Check
                                type="checkbox"
                                label={item}
                                checked={!food[item]}
                                onChange={() => handleCheckboxChangeFood(item)}
                            />
                        </Col>
                    ))}
                  </Row>
                  <Button variant="primary" type="button" onClick={handleUpdateFood} size="sm">
                    Update
                  </Button>
                </Form>
            </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <h1>Thông tin đơn hàng</h1>
            <Button variant="danger" onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
              Xóa đơn hàng
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive style={thStyle}>
              <thead>
                <tr>
                  <th>Xóa</th>
                  <th>Stt</th>
                  <th>Tên</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th style={{ whiteSpace: 'nowrap' }}>Ghi chú cho quán</th>
                  <th>Thời gian</th>
                  <th>Tré trộn</th>
                  <th>Chân vịt</th>
                  <th>Chả nướng</th>
                  <th>Bánh sừng bò</th>
                  <th>Tóp da</th>
                  <th>Chân gà</th>
                  <th>Nem gân</th>
                  <th>Sủi dìn</th>
                  <th>Trà tắc</th>
                  <th>Action</th>
                </tr>
              </thead>
          
              <tbody>
                {userInformations.map((user, index) => (
                  <tr key={user.id} style={{ backgroundColor: user.check === 0 ? 'lightgreen' : 'transparent' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.address}</td>
                    <td>{user.phone}</td>
                    <td style={{wordBreak: 'break-word'}}>{user.note}</td>
                    <td>{user.now}</td>
                    <td>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Size S</th>
                            <th>Size M</th>
                            <th>Size L</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{user.treTronX}</td>
                            <td>{user.treTronM}</td>
                            <td>{user.treTronL}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </td>
                    <td>{user.chanvit}</td>
                    <td>{user.chaNuong}</td>
                    <td>{user.banhDauBo}</td>
                    <td>{user.topda}</td>
                    <td>{user.changa}</td>
                    <td>{user.nemnuong}</td>
                    <td>{user.suidin}</td>
                    <td>{user.tratac}</td>
                    <td>
                    {user.check === 1 ? (
                        "Checked 👍" 
                      ) : (
                        <Button onClick={() => handleCheckChange(user.id)} disabled={user.check === 1}>
                          check!
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
}

export default UserManagement;
