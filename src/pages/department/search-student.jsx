import { useEffect, useState } from "react";
import { Search } from "lucide-react";
// import images from "@/constants/images";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SearchStudent = () => {
  const [searchStudent, setSearchStudent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const navigator = useNavigate();

  const [studentDetails, setStudentDetails] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/department/get-students", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStudentDetails(data);
      });
  }, []);

  const filteredStudents = studentDetails.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.branch.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredStudents.length / studentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleSearch = (event) => {
    setSearchStudent(event.target.value);
    setCurrentPage(1);
  };

  const detailHandler = (event) => {
    console.log(event);
    // Handle details click
  };

  const addFineHandler = (event) => {
    let name = event.target.getAttribute("data-name");
    let rollno = event.target.getAttribute("data-rollno");
    let mail = event.target.getAttribute("data-mail");
    navigator(`/department/new?name=${name}&rollno=${rollno}&mail=${mail}`);
  };

  return (
    <>
      <div className="flex flex-col justify-start h-full">
        <div className="w-full h-1/5 flex flex-row justify-between py-4 flex-wrap">
          <div className="md:w-3/5 w-full flex flex-row justify-center">
            <form className="flex items-center relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                className="rounded-[33px] p-3 pl-12 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                type="text"
                placeholder="Name, Roll No, Branch, ..."
                value={searchStudent}
                onChange={handleSearch}
              />
            </form>
          </div>
        </div>
        <div className="flex justify-center mt-3 mb-3">
          <ul className="flex">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  className={`mr-1 border px-1 py-1 ${
                    currentPage === number ? "text-red-500" : ""
                  }`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full flex-col flex-wrap pb-5">
          {currentStudents.map((studentDetail, index) => (
            <div
              key={index}
              className="w-full p-5 h-auto rounded-[20px] flex flex-col lg:flex-row bg-[#fff] justify-between flex-wrap mb-2"
            >
              <div className="flex flex-row justify-start items-center basis-1/3">
                <div
                  className="w-[54.874px] h-[54.874px] ml-2 mb-2 rounded-full border-2  flex justify-center items-center text-3xl font-regular text-gray-400 bg-gray-200"
                  alt="profile"
                >
                  {studentDetail.name[0].toUpperCase()}
                </div>
                <div className="ml-[30px] font-medium md:text-[20px] text-[12px]">
                  {studentDetail.name}
                  <br />
                  <div className="md:text-[20px] text-[12px] font-light">
                    {studentDetail.rollNumber}
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center text-[12px] lg:text-[20px] font-light mb-7 basis-1/3">
                <div className="mr-4 md:mr-[27px]">{studentDetail.role}</div>
                {/* <div className="mr-4 md:mr-[27px]">{studentDetail.branch}</div> */}
                <div className="mr-4 md:mr-[27px]">{studentDetail.batch}</div>
              </div>
              <div className="flex flex-row justify-center items-center md:basis-1/3 basis-1">
                <Button
                  className={`${"bg-white text-[#538ff8] hover:text-[#538ff8] hover:bg-[#538ff81f]"} md:mb-0 flex-1 lg:text-lg font-light mr-2 md:mr-4 py-5`}
                  style={{ border: "1px solid #538ff8" }}
                  onClick={detailHandler}
                >
                  Details
                </Button>
                <Button
                  variant="ezDues"
                  className=" lg:text-lg w-auto md:w-1/2 rounded-md lg:py-6 flex-1 py-5"
                  data-name={studentDetail.name}
                  data-rollno={studentDetail.rollNumber}
                  data-mail={studentDetail.email}
                  onClick={addFineHandler}
                >
                  + Add Fine
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchStudent;
