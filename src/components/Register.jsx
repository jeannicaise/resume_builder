import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  Container, 
  VStack, 
  Text, 
  useToast 
} from '@chakra-ui/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast(); // Utilisé pour les notifications

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      toast({
        title: "Inscription réussie.",
        description: "Vous avez été inscrit avec succès !",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur lors de l'inscription.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Erreur lors de l\'inscription', error);
    }
  };

  return (
    <Container maxW="md" mt={10}>
      <Box borderWidth={1} borderRadius="lg" p={6}>
        <VStack spacing={4}>
          <Heading as="h2" size="lg">Inscription pour créer un CV et l'enregistrer</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="username" isRequired>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme="teal" type="submit" width="full">
              S'inscrire
            </Button>
          </form>
          <Text>
            Déjà un compte ?<Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>Connectez-vous</Button>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
