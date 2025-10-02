import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  //single chat ke liye Ui me
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`,
        config
      );
      
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Fialed to load the message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  
  useEffect(() => {
    fetchMessages();
  },[selectedChat])

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
       const config = {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${user.token}`,
         },
       };
         setNewMessage("");
        const { data } = await axios.post("/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        
       
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error occured",
          description: "Fialed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            as="div"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {/* //group chat ka name dhikane ke liye single Chat me||single chat bi */}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages = {fetchMessages}
                  />
                }
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Message dhikane ke liye  */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
                <div className="messages">
                  {/* {Message} */}
                  <ScrollableChat messages={messages}/>
                </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click on a user to Start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
