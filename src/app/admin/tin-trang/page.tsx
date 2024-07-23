
'use client';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../public/firebaseConfig';

const UserManagement = () => {
  const [userInformations, setuserInformations] = useState<UserInformation[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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
            banhChung: doc.data().banhChung,
            chaNuong: doc.data().chaNuong,
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

  const thStyle = {
    textAlign: 'center' as const,
    verticalAlign: 'middle' as const,
  };

    return (
      <Container>
        <Row className="my-4">
          <Col>
            <h1>User Management</h1>
            <Button variant="danger" onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
              Delete User
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
                  <th>Ghi chú cho quán</th>
                  <th>Thời gian</th>
                  <th>Tré trộn</th>
                  <th>Bánh chưng</th>
                  <th>Chả nướng</th>
                  <th>Bánh đầu bò</th>
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
                    <td>{user.note}</td>
                    <td>{user.now}</td>
                    <td>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Size X</th>
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
                    <td>{user.banhChung}</td>
                    <td>{user.chaNuong}</td>
                    <td>{user.banhDauBo}</td>
                    <td>
                    <Button onClick={() => handleCheckChange(user.id)} disabled={user.check === 1}>
                      Đã check !
                    </Button>
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
