import { FormControl, FormHelperText, FormLabel, Textarea, Stack, Button, HStack, useToast } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";

const SummaryAndSkillsEdit = ({ resumeInfo, setResumeInfo, setPage }) => {
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const [error, setError] = useState(null);
  const toast = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/resume/${currentUser.id}/competence`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}` // Ajouter le token dans l'en-tête
          }
        });
        setResumeInfo(response.data);
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      }
    };

    fetchResumeData();
  }, [setResumeInfo, currentUser.id]);

  const SaveSummaryAndSkills = async () => {
    setLoading(true);
    try {
      // Essaye d'envoyer une requête PUT pour mettre à jour les données
      await axios.put(`http://localhost:5001/api/resume/${user_id}/competence`, {
        summary: resumeInfo.competence.summary,
        skills: resumeInfo.competence.skills,
      });

      toast({
        title: "CV sauvegardé avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si la requête PUT échoue avec une erreur 404, essaye une requête POST
        try {
          await axios.post(`http://localhost:5001/api/resume/${user_id}/competence`, {
            summary: resumeInfo.competence.summary,
            skills: resumeInfo.competence.skills,
          });

          toast({
            title: "CV créé avec succès !",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (postError) {
          console.error("Erreur lors de la création du CV:", postError);
          toast({
            title: "Erreur lors de la création du CV.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        // Pour les autres erreurs
        console.error("Erreur lors de la sauvegarde du CV:", error);
        toast({
          title: "Erreur lors de la sauvegarde du CV.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Summary:</FormLabel>
        <Textarea
          placeholder="Introduce yourself by pitching your skills & explaining how they can be of value to a company"
          value={resumeInfo.competence.summary}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.competence,
              summary: e.target.value,
            };
            setResumeInfo({ ...resumeInfo, competence: updatedValue });
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Skills:</FormLabel>
        <Textarea
          placeholder="Communication, Teambuilding, etc."
          value={resumeInfo.competence.skills}
          onChange={(e) => {
            const updatedValue = {
              ...resumeInfo.competence,
              skills: e.target.value,
            };
            setResumeInfo({ ...resumeInfo, competence: updatedValue });
          }}
        />
        <FormHelperText>Hit enter for newline</FormHelperText>
      </FormControl>

      <HStack spacing={8} justify="center">
        <Button
          colorScheme="whatsapp"
          onClick={SaveSummaryAndSkills}
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

export default SummaryAndSkillsEdit;
