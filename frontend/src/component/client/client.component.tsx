import React from 'react';
import Avatar from 'react-avatar';

// Define props interface for better type safety
interface ClientProps {
  username: string;
}

const ClientAvatar: React.FC<ClientProps> = ({ username }) => {
  return (
    <div className="flex items-center mb-3">
      <Avatar
        name={username}
        size="50"
        round="14px"
        className="mr-3"
      />
      <span className="ml-2">{username}</span>
    </div>
  );
};

export default ClientAvatar;
