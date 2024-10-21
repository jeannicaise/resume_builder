import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  SimpleGrid,
  Stack,
  FormControl,
  Input,
  HStack,
  FormHelperText,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';


const EducationDetailsEdit = ({ setPage }) => {
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const [error, setError] = useState(null);
  const toast = useToast();
  const [resumeInfo, setResumeInfo] = useState({ education: [] });
  const [educationSections, setEducationSections] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/resume/${currentUser.id}/education`, {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}` // Ajouter le token dans l'en-tête
            }
          }
        );
        if (response.data && response.data.education) {
          setResumeInfo(response.data);
          setEducationSections(response.data.education); // Charge les sections d'éducation existantes
        } else {
          setResumeInfo({ education: [] });
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
        setResumeInfo({ education: [] });
      }
    };
    fetchResumeData();
  }, [user_id]);

  console.log(resumeInfo);
  
  const saveEducationData = async () => {
    setLoading(true);    

    const existingEducationEntries = resumeInfo.education.filter(edu => edu.eduId); // Celles avec un ID
    const newEducationEntries = resumeInfo.education.filter(edu => !edu.eduId); // Celles sans ID

    // Mapper les noms des propriétés pour correspondre à la base de données
    const mappedEducation = existingEducationEntries.map(edu => ({
      edu_id: edu.eduId,  // Assurez-vous que vous avez les bons ID ici
      institution_name: edu.college, 
      degree: edu.course,
      start_date: edu.startDate,
      end_date: edu.endDate,
    }));

     // Mapper les noms des propriétés pour correspondre à la base de données
     const mappedNewEducationEntries = newEducationEntries.map(edu => ({
      institution_name: edu.college, 
      degree: edu.course,
      start_date: edu.startDate,
      end_date: edu.endDate,
    }));

    console.log(mappedNewEducationEntries);
    
try {
  // Effectuer la requête PUT pour les expériences existantes
  if (mappedEducation.length > 0) {
    await axios.put(`http://localhost:5001/api/resume/${user_id}/education`, {
      educationEntries: mappedEducation ,
    });
  }
// Effectuer une requête POST unique pour les nouvelles expériences
if (mappedNewEducationEntries.length > 0) {
  await axios.post(`http://localhost:5001/api/resume/${user_id}/education`, {
    educationEntries: mappedNewEducationEntries,
  });
} 
      toast({
        title: "Éducation sauvegardée avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données d'éducation:", error);
      toast({
        title: "Erreur lors de la sauvegarde des données d'éducation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  const createEducationSection = () => {
    const newSection = { college: "", course: "", startDate: "", endDate: "" };
  
    setEducationSections((prev) => [...prev, newSection]);
  
    setResumeInfo((prev) => ({
      ...prev,
      education: [...prev.education, newSection],
    }));
  
    console.log("New Education Section Added:", newSection);
    console.log("Updated resumeInfo.education:", resumeInfo.education);
  };
  
  const educationForm = (index, eduData) => (
    <SimpleGrid spacing={4} columns={[1, 1, 1, 2]} key={index}>
      <FormControl>
        <FormLabel>College/University or School:</FormLabel>
        <Input
          type="text"
          placeholder="school, college or university name"
          value={eduData.college || ""}
          onChange={(e) => {
            const newSections = [...educationSections];
            newSections[index].college = e.target.value;
            setEducationSections(newSections);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Course/Degree:</FormLabel>
        <Input
          type="text"
          placeholder="Bachelors, Masters or High school diploma"
          value={eduData.course|| ""}
          onChange={(e) => {
            const newSections = [...educationSections];
            newSections[index].course = e.target.value;
            setEducationSections(newSections);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Start date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter start date or year"
          value={eduData.startDate|| ""}
          onChange={(e) => {
            const newSections = [...educationSections];
            newSections[index].startDate = e.target.value;
            setEducationSections(newSections);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter end date or year"
          value={eduData.endDate|| ""}
          onChange={(e) => {
            const newSections = [...educationSections];
            newSections[index].endDate = e.target.value;
            setEducationSections(newSections);
          }}
        />
        <FormHelperText>Write "present" if ongoing</FormHelperText>
      </FormControl>
    </SimpleGrid>
  );

  return (
    <Stack spacing={4}>
      {educationSections.map((edu, index) => educationForm(index, edu))}

      <Button
        colorScheme="messenger"
        onClick={createEducationSection}
        w="max-content"
        rightIcon={<AddIcon />}
      >
        Add Education
      </Button>

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
          onClick={saveEducationData}
          isLoading={loading}
        >
          Save
        </Button>
        <Button
          colorScheme="whatsapp"
          onClick={() => setPage((p) => p + 1)}
          rightIcon={<ChevronRightIcon />}
        >
          Next Section
        </Button>
      </HStack>
    </Stack>
  );
};

export default EducationDetailsEdit;
