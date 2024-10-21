
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Pour les requêtes API

const BasicDetails = ({ user_id },props) => {
    const { setPage } = props;
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
    address: ''
  });

  // Récupérer les données du CV lors du chargement du composant
  useEffect(() => {
    axios.get(`http://localhost:5000/resume/1/profile`)
      .then(response => setProfile(response.data))
      .catch(error => console.error('Error fetching profile data:', error));
  }, [user_id]);

  // Gérer les changements de champs
  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Enregistrer les données modifiées
  const saveProfile = () => {
    axios.put(`http://localhost:5000/resume/1/profile`, profile)
      .then(response => alert('Profile updated successfully!'))
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <Stack>
      <SimpleGrid columns={2} spacing={4}>
        <FormControl>
          <FormLabel>First name:</FormLabel>
          <Input
            type="text"
            value={profile.firstname}
            onChange={(e) => handleChange('firstname', e.target.value)}

          />
        </FormControl>
        <FormControl>
          <FormLabel>Last name:</FormLabel>
          <Input
            type="text"
            value={profile.lastname}
            onChange={(e) => handleChange('lastname', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number:</FormLabel>
          <Input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address:</FormLabel>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>LinkedIn:</FormLabel>
          <Input
            type="url"
            value={profile.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Github:</FormLabel>
          <Input
            type="url"
            value={profile.github}
            onChange={(e) => handleChange('github', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Portfolio or Website:</FormLabel>
          <Input
            type="url"
            value={profile.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Address:</FormLabel>
          <Input
            type="text"
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </FormControl>
      </SimpleGrid>

      <Button colorScheme="whatsapp" onClick={saveProfile} rightIcon={<ChevronRightIcon />}>
        Save
      </Button>

      <Button colorScheme="whatsapp"  onClick={() => {
            setPage((p) => p + 1);
          }} rightIcon={<ChevronRightIcon />}>
        Page suivante
      </Button>
    </Stack>
  );
};

export default BasicDetails;
