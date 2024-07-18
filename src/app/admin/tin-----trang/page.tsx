
'use client';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../../public/firebaseConfig';


const UserManagement = () => {
  const [userInformations, setuserInformations] = useState<UserInformation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = query(collection(db, "customer"));
        const querySnapshot = await getDocs(usersRef);
        const fetchedUsers: any[] = [];
  
        querySnapshot.forEach((doc) => {
          const userInformation: UserInformation = {
            id: doc.id,
            treTron: doc.data().treTron,
            banhChung: doc.data().banhChung,
            chaNuong: doc.data().chaNuong,
            banhDauBo: doc.data().banhDauBo,
            name: doc.data().name,
            address: doc.data().address,
            phone: doc.data().phone,
            note:doc.data().note,
            now: doc.data().now,
          };
          fetchedUsers.push(userInformation);
        });

        const convertToDate = (str: string) => {
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

    return (
      <Container>
        <Row className="my-4">
          <Col>
            <h1>User Management</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Ghi chú cho quán</th>
                  <th>Thời gian</th>
                  <th>Tré trộn</th>
                  <th>Bánh chưng</th>
                  <th>Chả nướng</th>
                  <th>Bánh đầu bò</th>
                </tr>
              </thead>
              <tbody>
                {userInformations.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.address}</td>
                    <td>{user.phone}</td>
                    <td>{user.note}</td>
                    <td>{user.now}</td>
                    <td>{user.treTron}</td>
                    <td>{user.banhChung}</td>
                    <td>{user.chaNuong}</td>
                    <td>{user.banhDauBo}</td>
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
