// import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
// import {
//   Button,
//   FormLabel,
//   SimpleGrid,
//   Stack,
//   FormControl,
//   Input,
//   HStack,
//   FormHelperText,
// } from "@chakra-ui/react";
// import React from "react";

// const EducationDetails = (props) => {
//   const { resumeInfo, setResumeInfo, setPage } = props;

//   const [educationSection, setEduactionSection] = React.useState([]);
//   const [certificateSection, setCertificateSection] = React.useState([]);

//   const [educationData, setEducationData] = React.useState({
//     college: "",
//     course: "",
//     startDate: "",
//     endDate: "",
//   });

//   const [certificateData, setCertificateData] = React.useState({
//     link: "",
//     details: "",
//   });

//   const saveEducationData = () => {
//     const isEmpty = Object.values(educationData).some((x) => x === "");
//     if (isEmpty) return;

//     const duplicate = () => {
//       let arr = resumeInfo.education;
//       for (let i = 0; i < arr.length; i++) {
//         if (JSON.stringify(arr[i]) === JSON.stringify(educationData)) {
//           return true;
//         }
//       }
//       return false;
//     };

//     if (duplicate()) return;

//     const updateValue = {
//       ...resumeInfo,
//       education: resumeInfo.education.concat(educationData),
//     };
//     setResumeInfo(updateValue);
//   };

//   const saveCertificateData = () => {
//     const isEmpty = Object.values(certificateData).some((x) => x.trim() === "");
//     if (isEmpty) return;

//     const duplicate = () => {
//       let arr = resumeInfo.certification;
//       for (let i = 0; i < arr.length; i++) {
//         if (JSON.stringify(arr[i]) === JSON.stringify(certificateData)) {
//           return true;
//         }
//       }
//       return false;
//     };

//     if (duplicate()) return;

//     const updateValue = {
//       ...resumeInfo,
//       certification: resumeInfo.certification.concat(certificateData),
//     };
//     setResumeInfo(updateValue);
//   };

//   React.useEffect(() => {
//     saveEducationData();
//   }, [educationSection.length]);

//   React.useEffect(() => {
//     saveCertificateData();
//   }, [certificateSection.length]);

//   const createCertificateSection = () => {
//     setCertificateSection(
//       certificateSection.concat(
//         <FormControl key={certificateSection.length}>
//           <FormLabel>Certificate Link: </FormLabel>
//           <Input
//             type="url"
//             placeholder="Enter Certificate"
//             mb={4}
//             onChange={(e) => {
//               setCertificateData((prev) => ({ ...prev, link: e.target.value }));
//             }}
//           />
//           <FormLabel>Additional Details: </FormLabel>
//           <Input
//             type="text"
//             placeholder="eg. Level 1 or React or Data Science"
//             onChange={(e) => {
//               setCertificateData((prev) => ({
//                 ...prev,
//                 details: e.target.value,
//               }));
//             }}
//           />
//         </FormControl>
//       )
//     );
//   };

//   const createEducationSection = () => {
//     setEduactionSection(educationSection.concat(educationForm()));
//   };

//   const educationForm = () => (
//     <SimpleGrid
//       spacing={4}
//       columns={[1, 1, 1, 2]}
//       key={educationSection.length}
//     >
//       <FormControl>
//         <FormLabel>College/University or School: </FormLabel>
//         <Input
//           type="text"
//           placeholder="school, college or university name"
//           onChange={(e) => {
//             setEducationData((prev) => ({ ...prev, college: e.target.value }));
//           }}
//         />
//       </FormControl>
//       <FormControl>
//         <FormLabel>Course/Degree or Graduation: </FormLabel>
//         <Input
//           type="text"
//           placeholder="Bachelors, Masters or High school diploma"
//           onChange={(e) => {
//             setEducationData((prev) => ({ ...prev, course: e.target.value }));
//           }}
//         />
//       </FormControl>
//       <FormControl>
//         <FormLabel>Start date: </FormLabel>
//         <Input
//           type="text"
//           placeholder="Enter start date or year jan 2022"
//           onChange={(e) => {
//             setEducationData((prev) => ({
//               ...prev,
//               startDate: e.target.value,
//             }));
//           }}
//         />
//       </FormControl>
//       <FormControl>
//         <FormLabel>End date: </FormLabel>
//         <Input
//           type="text"
//           placeholder="Enter end date or year march 2022"
//           onChange={(e) => {
//             setEducationData((prev) => ({ ...prev, endDate: e.target.value }));
//           }}
//         />
//         <FormHelperText>write present if ongoing</FormHelperText>
//       </FormControl>
//     </SimpleGrid>
//   );

//   return (
//     <Stack>
//       <SimpleGrid spacing={4} columns={[1, 1, 1, 2]}>
//         <FormControl>
//           <FormLabel>College/University or School: </FormLabel>
//           <Input
//             type="text"
//             placeholder="school, college or university name"
//             onChange={(e) => {
//               setEducationData((prev) => ({
//                 ...prev,
//                 college: e.target.value,
//               }));
//             }}
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Course/Degree or Graduation: </FormLabel>
//           <Input
//             type="text"
//             placeholder="Bachelors, Masters or High school diploma"
//             onChange={(e) => {
//               setEducationData((prev) => ({ ...prev, course: e.target.value }));
//             }}
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>Start date: </FormLabel>
//           <Input
//             type="text"
//             placeholder="Enter start date or year jan 2022"
//             onChange={(e) => {
//               setEducationData((prev) => ({
//                 ...prev,
//                 startDate: e.target.value,
//               }));
//             }}
//           />
//         </FormControl>
//         <FormControl>
//           <FormLabel>End date: </FormLabel>
//           <Input
//             type="text"
//             placeholder="Enter end date or year march 2022"
//             onChange={(e) => {
//               setEducationData((prev) => ({
//                 ...prev,
//                 endDate: e.target.value,
//               }));
//             }}
//           />
//           <FormHelperText>write present if ongoing</FormHelperText>
//         </FormControl>
//       </SimpleGrid>
//       {educationSection}
//       {certificateSection}
//       <Button
//         colorScheme="whatsapp"
//         onClick={() => {
//           createEducationSection();
//         }}
//         w="max-content"
//         rightIcon={<AddIcon />}
//       >
//         Add Education
//       </Button>
//       <Button
//         colorScheme="whatsapp"
//         onClick={() => {
//           saveEducationData();
//           createCertificateSection();
//         }}
//         w="max-content"
//         rightIcon={<AddIcon />}
//       >
//         Add Certificates
//       </Button>
//       <HStack spacing={8} justify="center">
//         <Button
//           colorScheme="blue"
//           onClick={() => {
//             setPage((p) => p - 1);
//           }}
//           leftIcon={<ChevronLeftIcon />}
//         >
//           {" "}
//           back{" "}
//         </Button>
//         <Button
//           colorScheme="whatsapp"
//           onClick={() => {
//             saveEducationData();
//             saveCertificateData();
//           }}
//           rightIcon={<ChevronRightIcon />}
//         >
//           Save & Submit
//         </Button>
//       </HStack>
//     </Stack>
//   );
// };

// export default EducationDetails;


import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const BasicDetails = (props) => {
  const { resumeInfo, setResumeInfo, setPage } = props;

  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
    address: ''
  });

  // Fonction pour récupérer les données du CV à partir de l'API
  useEffect(() => {
    axios.get(`/api/user/${resumeInfo.user_id}/profile`)
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => console.error('Error fetching profile data:', error));
  }, [resumeInfo.user_id]);

  // Sauvegarder les données de profil
  const saveProfileData = () => {
    const isEmpty = Object.values(profileData).some((x) => x.trim() === "");
    if (isEmpty) return; // Ne rien faire si un champ est vide

    const updatedResume = {
      ...resumeInfo,
      profile: profileData,
    };

    setResumeInfo(updatedResume);

    axios.put(`/api/user/${resumeInfo.user_id}/profile`, profileData)
      .then(() => {
        alert('Profile updated successfully!');
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <Stack>
      <SimpleGrid spacing={4} columns={[1, 1, 1, 2]}>
        <FormControl>
          <FormLabel>First name:</FormLabel>
          <Input
            type="text"
            value={profileData.firstname}
            onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Last name:</FormLabel>
          <Input
            type="text"
            value={profileData.lastname}
            onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number:</FormLabel>
          <Input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address:</FormLabel>
          <Input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>LinkedIn:</FormLabel>
          <Input
            type="url"
            value={profileData.linkedin}
            onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Github:</FormLabel>
          <Input
            type="url"
            value={profileData.github}
            onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Portfolio or Website:</FormLabel>
          <Input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Address:</FormLabel>
          <Input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          />
        </FormControl>
      </SimpleGrid>

      {/* Navigation buttons */}
      <HStack spacing={8} justify="center">
        <Button
          colorScheme="blue"
          onClick={() => setPage((p) => p - 1)}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Button
          colorScheme="whatsapp"
          onClick={() => {
            saveProfileData();
            setPage((p) => p + 1); // Aller à la page suivante après la sauvegarde
          }}
          rightIcon={<ChevronRightIcon />}
        >
          Save & Next
        </Button>
      </HStack>
    </Stack>
  );
};

export default BasicDetails;
