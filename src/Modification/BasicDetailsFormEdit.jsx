import { AddIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const BasicDetailsEdit = (props) => {
  const { resumeInfo, setResumeInfo, setPage } = props;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();


  useEffect(() => {
    
    const fetchResumeData = async () => {
      try {
  
         // Exemple : obtenir le token du localStorage
        const response = await axios.get(`http://localhost:5001/api/resume/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}` // Ajouter le token dans l'en-tête
          }
        });
        setResumeInfo(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching resume data:", error);
        setError("Failed to load resume data. Please try again later.");
      }
    };
  
    fetchResumeData();
  }, [setResumeInfo, currentUser.id]);
  

  const saveBasicDetails = async () => {
    setLoading(true);
    try {
      // Envoi de la requête PUT au backend pour mettre à jour les données
      await axios.put(`http://localhost:5001/resume/${user_id}/profile`, {
        firstname: resumeInfo.profile.firstname,
        lastname: resumeInfo.profile.lastname,
        phone: resumeInfo.profile.phone,
        email: resumeInfo.profile.email,
        linkedin: resumeInfo.profile.linkedin,
        github: resumeInfo.profile.github,
        website: resumeInfo.profile.website,
        address: resumeInfo.profile.address,
      });

      toast({
        title: "CV sauvegardé avec succès !",
        status: "success", 
        duration: 3000,
        isClosable: true,
      });

      window.location.reload();

    } catch (error) {
      console.error("Erreur lors de la sauvegarde du CV:", error);
      toast({
        title: "Erreur lors de la sauvegarde du CV.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={4} placeItems="center">
        <FormControl>
          <FormLabel>First name:</FormLabel>
          <Input
            type="text"
            placeholder="Your first name"
            value={resumeInfo.profile.firstname}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                firstname: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Last name:</FormLabel>
          <Input
            type="text"
            placeholder="Your last name"
            value={resumeInfo.profile.lastname}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                lastname: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number:</FormLabel>
          <InputGroup>
            <InputLeftAddon children="+33" color="blue.600" />
            <Input
              type="tel"
              placeholder="phone number"
              maxLength={10}
              pattern="[0-9]{10}"
              value={resumeInfo.profile.phone}
              onChange={(e) => {
                const updateValue = {
                  ...resumeInfo.profile,
                  phone: e.target.value,
                };
                const updateResumeInfo = {
                  ...resumeInfo,
                  profile: updateValue,
                };
                setResumeInfo(updateResumeInfo);
              }}
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Email address:</FormLabel>
          <Input
            type="email"
            placeholder="Your email address"
            value={resumeInfo.profile.email}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                email: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
          <FormHelperText>
            Enter email address to get contacted for jobs
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Linkedin:</FormLabel>
          <Input
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            value={resumeInfo.profile.linkedin}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                linkedin: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Github:</FormLabel>
          <Input
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            value={resumeInfo.profile.github}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                github: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Portfolio or Website:</FormLabel>
          <Input
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            value={resumeInfo.profile.website}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                website: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Adresse: </FormLabel>
          <Input
            type="text"
            placeholder="city, country"
            value={resumeInfo.profile.address}
            onChange={(e) => {
              const updateValue = {
                ...resumeInfo.profile,
                address: e.target.value,
              };
              const updateResumeInfo = { ...resumeInfo, profile: updateValue };
              setResumeInfo(updateResumeInfo);
            }}
          />
        </FormControl>
      </SimpleGrid>
      <Center mt={8}>
        <Button
          colorScheme="whatsapp"
          onClick={saveBasicDetails}
          rightIcon={<ChevronRightIcon />}
        >
          Save
        </Button>

        <Button
          colorScheme="whatsapp"
          onClick={() => {
            setPage((p) => p + 1);
          }}
          rightIcon={<ChevronRightIcon />}
        >
          Next Section
        </Button>
      </Center>
    </Stack>
  );
};

export default BasicDetailsEdit;
