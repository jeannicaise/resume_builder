import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Textarea,
  useToast,
  Text, // Ajout de Text pour afficher un message si aucun travail n'est disponible
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const WorkExperiencesEdit = ({ setPage }) => {
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const [error, setError] = useState(null);
  const toast = useToast();
  const [resumeInfo, setResumeInfo] = useState({ work: [] }); // Initialisation avec une structure par défaut
  const { currentUser } = useAuth();

  // Ajouter une section de travail par défaut si elle est vide
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/resume/${currentUser.id}/experience`, {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}` // Ajouter le token dans l'en-tête
            }
          }
        );
        // Vérifiez que response.data a bien une structure valide
        if (response.data) {
          setResumeInfo(response.data);
          console.log(response.data);
          
        } else {
          setResumeInfo({ work: [] }); // Assurez-vous que resumeInfo est toujours un objet valide
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
        setResumeInfo({ work: [] }); // Évitez d'avoir un état null
      }
    };
    fetchResumeData();
  }, [currentUser.id]);

  

  const handleWorkChange = (index, field, value) => {
    const updatedWork = [...resumeInfo.work];
    updatedWork[index] = { ...updatedWork[index], [field]: value };
    setResumeInfo({ ...resumeInfo, work: updatedWork });
  };

  const createWorkSection = () => {
    const updatedWork = [
      ...resumeInfo.work,
      { jobTitle: "", company: "", startDate: "", endDate: "", jobDetails: "" },
    ];
    setResumeInfo({ ...resumeInfo, work: updatedWork });
  };

  const saveWorkExperience = async () => {
    setLoading(true);
  
    // Séparer les expériences nouvelles et existantes
    const existingWork = resumeInfo.work.filter(work => work.workId); // Celles avec un ID
    const newWork = resumeInfo.work.filter(work => !work.workId); // Celles sans ID
  
    // Mapper les expériences existantes pour la requête PUT
    const mappedExistingWork = existingWork.map(work => ({
      work_id: work.workId,
      company_name: work.company,
      start_date: work.startDate,
      end_date: work.endDate,
      description: work.jobDetails,
      role: work.jobTitle
    }));
  
    // Mapper les nouvelles expériences pour la requête POST
    const mappedNewWork = newWork.map(work => ({
      company_name: work.company,
      start_date: work.startDate,
      end_date: work.endDate,
      description: work.jobDetails,
      role: work.jobTitle
    }));
  
    try {
      // Effectuer la requête PUT pour les expériences existantes
      if (mappedExistingWork.length > 0) {
        await axios.put(`http://localhost:5001/api/resume/${user_id}/experience`, {
          workExperiences: mappedExistingWork,
        });
      }
    // Effectuer une requête POST unique pour les nouvelles expériences
    if (mappedNewWork.length > 0) {
      await axios.post(`http://localhost:5001/api/resume/${user_id}/experience`, {
        workExperiences: mappedNewWork,
      });
    }
  
      toast({
        title: "Expérience professionnelle sauvegardée avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des expériences professionnelles:", error);
      toast({
        title: "Erreur lors de la sauvegarde des expériences professionnelles.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  

  const workExperienceForm = (index, workData) => (
    <SimpleGrid spacing={4} columns={[1, 1, 1, 2]} key={index}>
      <FormControl>
        <FormLabel>Job Title:</FormLabel>
        <Input
          type="text"
          placeholder="Software developer"
          value={workData.jobTitle || ""} // Utiliser "" pour éviter l'erreur
          onChange={(e) => handleWorkChange(index, "jobTitle", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Company/Employer:</FormLabel>
        <Input
          type="text"
          placeholder="Employer(Company) name"
          value={workData.company || ""} // Utiliser "" pour éviter l'erreur
          onChange={(e) => handleWorkChange(index, "company", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Start date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter start date jan 2022"
          value={workData.startDate || ""} // Utiliser "" pour éviter l'erreur
          onChange={(e) => handleWorkChange(index, "startDate", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End date:</FormLabel>
        <Input
          type="text"
          placeholder="Enter end date jan 2023"
          value={workData.endDate || ""} // Utiliser "" pour éviter l'erreur
          onChange={(e) => handleWorkChange(index, "endDate", e.target.value)}
        />
        <FormHelperText>write present if ongoing</FormHelperText>
      </FormControl>
      <GridItem colSpan={[1, 1, 1, 2]}>
        <FormControl>
          <FormLabel>Job Details:</FormLabel>
          <Textarea
            placeholder="Describe your role and achievements"
            value={workData.jobDetails || ""} // Utiliser "" pour éviter l'erreur
            onChange={(e) => handleWorkChange(index, "jobDetails", e.target.value)}
          />
          <FormHelperText>Hit enter for newline</FormHelperText>
        </FormControl>
      </GridItem>
    </SimpleGrid>
  );

  return (
    <Stack spacing={4}>
      {/* Vérifiez que resumeInfo et resumeInfo.work existent avant de les rendre */}
      {resumeInfo && resumeInfo.work && resumeInfo.work.length > 0 ? (
        resumeInfo.work.map((work, index) => workExperienceForm(index, work))
      ) : (
        <Text>Aucune expérience professionnelle disponible.</Text>
      )}

      <Button
        colorScheme="messenger"
        onClick={createWorkSection}
        w="max-content"
        rightIcon={<AddIcon />}
      >
        Add Work Experience
      </Button>

      <HStack spacing={8} justify="center">
        <Button
          colorScheme="whatsapp"
          onClick={saveWorkExperience}
          isLoading={loading}
        >
          Save
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setPage((p) => p - 1)}
          leftIcon={<ChevronLeftIcon />}
        >
          Back
        </Button>
        <Button
          colorScheme="whatsapp"
          rightIcon={<ChevronRightIcon />}
          onClick={() => setPage((p) => p + 1)}
        >
          Next Section
        </Button>
      </HStack>
    </Stack>
  );
};

export default WorkExperiencesEdit;
