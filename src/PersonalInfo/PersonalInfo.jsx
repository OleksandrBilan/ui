import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation, useNavigate } from 'react-router-dom';
import './personalInfo.css';
import axios from "axios";
import { adminPositionId, apiPath, coachPostionId } from "../App";
import { Tag, Button, Table } from 'antd';
import 'antd/dist/antd.css';

const PersonalInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navEmployee = location.state.navEmployee;
    const employee = location.state.employee ?? navEmployee;
    const [coach, setCoach] = useState();
    const [individualCoach, setIndCoach] = useState();
    const [educationData, setEducationData] = useState();
    const [jobsData, setJobsData] = useState();
    const [render, setRender] = useState(0);

    useEffect(() => {
        if (employee.position.id == coachPostionId) {
            axios.get(apiPath + 'coach/getByEmployeeId', {params: {employeeId: employee.id}}).then(response => {
                let tempCoach = response.data;
                setCoach(response.data);

                axios.get(apiPath + 'coach/individualCoaches').then(response => {
                    let temp = response.data.filter(ic => ic.coachInfo.id == tempCoach.id)[0];
                    setIndCoach(temp);
                }).catch(error => {});
            });
        }

        let tempEducationData = [];
        employee.educations.forEach(e => {
            tempEducationData.push({
                key: e.id,
                specialty: e.specialty.name,
                level: e.level.name,
                university: e.university.name,
                graduationDate: new Date(e.graduationDate).toLocaleDateString()
            })
        });
        setEducationData(tempEducationData);

        let tempJobsData = [];
        employee.previousJobs.forEach(j => {
            tempJobsData.push({
                key: j.id,
                company: j.company.name,
                startDate: new Date(j.startDate).toLocaleDateString(),
                endDate: new Date(j.endDate).toLocaleDateString()
            })
        });
        setJobsData(tempJobsData);
    }, [render])

    const onDelete = () => {
        if (window.confirm('???? ????????????????, ???? ???????????? ???????????????? ?????? ???????????')) {
            axios.delete(apiPath + 'employee/delete?id=' + employee.id).then(() => {
                navigate('/employees', {state: {navEmployee: navEmployee, employee: employee}});
            });
        }
    }

    const onEdit = () => {
        navigate('/editEmployee', {state: {employee: employee, navEmployee: navEmployee}});
    }

    const educationColumns = [
        {
            title: "??????????????????????????",
            dataIndex: 'specialty',
            key: 'specialty'
        },
        {
            title: "????????????",
            dataIndex: 'level',
            key: 'level'
        },
        {
            title: '???????????????????? ????????????',
            dataIndex: 'university',
            key: 'university',
        },
        {
            title: '???????? ????????????????????',
            dataIndex: 'graduationDate',
            key: 'graduationDate'
        }
    ];

    const jobsColumns = [
        {
            title: "?????????? ??????????",
            dataIndex: 'company',
            key: 'company'
        },
        {
            title: '???????? ??????????????',
            dataIndex: 'startDate',
            key: 'startDate'
        },
        {
            title: '???????? ????????????????????',
            dataIndex: 'endDate',
            key: 'endDate'
        }
    ]

    const onEducationDelete = id => {
        if (window.confirm('???? ????????????????, ???? ???????????? ???????????????? ?????? ???????????')) {
            axios.delete(apiPath + 'employee/deleteEmployeeEducation?id=' + id).then(() => {
                employee.educations = employee.educations.filter(j => j.id != id);
                setRender(render + 1);
            });
        }
    }

    const onPreviousJobDelete = id => {
        if (window.confirm('???? ????????????????, ???? ???????????? ???????????????? ?????? ???????????')) {
            axios.delete(apiPath + 'employee/deleteEmployeePreviousJob?id=' + id).then(() => {
                employee.previousJobs = employee.previousJobs.filter(j => j.id != id);
                setRender(render + 1);
            });
        }
    }

    const onEducationRow = (record, rowIndex) => ({
        onContextMenu: e => {
            e.preventDefault();
            if (navEmployee.position.id == adminPositionId)
                onEducationDelete(employee.educations[rowIndex].id);
        },
        onClick: () => {
            if (navEmployee.position.id == adminPositionId)
                navigate('/editEmployeeEducation', {state: {navEmployee: navEmployee, employee: employee, education: employee.educations[rowIndex]}});
        }
    })

    const onJobRow = (record, rowIndex) => ({
        onContextMenu: e => {
            e.preventDefault();
            if (navEmployee.position.id == adminPositionId)
                onPreviousJobDelete(employee.previousJobs[rowIndex].id);
        },
        onClick: () => {
            if (navEmployee.position.id == adminPositionId)
                navigate('/editEmployeePreviousJob', {state: {navEmployee: navEmployee, employee: employee, job: employee.previousJobs[rowIndex]}});
        }
    })

    return (
        <>
        <Navbar employee={navEmployee} />
        <div className="personal-info">
            <div className="employee-info">
                <h1>??????????????????</h1>
                <h2>????'??: {employee.firstName}</h2>
                <h2>????????????????: {employee.lastName}</h2>
                <h2>?????????? ????????????????: {employee.phoneNumber}</h2>
                <h2>????????????: {employee.position.name}</h2>
                <h2>???????? ??????????: {new Date(employee.hireDate).toLocaleDateString()}</h2>
                {navEmployee.position.id == adminPositionId && <h2>??????????: {employee.login}</h2>}
                <h1>??????</h1>
                <h2>??????????: {employee.gym.city.name}</h2>
                <h2>????????????: {employee.gym.address}</h2>
                <h2>????????????????: {employee.gym.phoneNumber}</h2>
            </div>
            <div className="additional-info">
                <div className="education">
                    <h1>????????????</h1>
                    <Table 
                    dataSource={educationData}
                    columns={educationColumns}
                    pagination={false}
                    onRow={onEducationRow}
                    />
                    {navEmployee.position.id == adminPositionId &&
                    <Button type="primary" className="additional-button" onClick={() => navigate('/addEmployeeEducation', {state: {navEmployee: navEmployee, employee: employee}})}>???????????? ??????????</Button>}
                </div>
                <div className="jobs">
                    <h1>?????????????????? ????????????</h1>
                    <Table 
                    dataSource={jobsData}
                    columns={jobsColumns}
                    pagination={false}
                    onRow={onJobRow}
                    />
                    {navEmployee.position.id == adminPositionId &&
                    <Button type="primary" className="additional-button" onClick={() => navigate('/addEmployeePreviousJob', {state: {navEmployee: navEmployee, employee: employee}})}>???????????? ??????????</Button>}
                </div>
            </div>
        </div>
        <div className="coach-info">
            {coach != null &&
                <>
                <h1>???????? ????????????</h1>
                <h2>{coach.sportTypes.map(t => <Tag color='blue'>{t?.name}</Tag>)}</h2>
                <h1>????????</h1>
                <h2>{coach.description}</h2>
                </>}
            {individualCoach != null &&
                <>
                <h1>?????????????????????????? ????????????????????</h1>
                <h2>???????? ???? ????????????: {individualCoach.pricePerHour}</h2>
                </>}
        </div>
        {navEmployee.position.id == adminPositionId &&
        <div className="buttons">
            <Button type="primary" onClick={() => onEdit()}>??????????????</Button>
            {employee.id != navEmployee.id &&
                <Button type="danger" onClick={() => onDelete()}>????????????????</Button>}
        </div>}
        </>
    )
}

export default PersonalInfo;