'use client';

import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Send,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const contacts = [
  { id: 1, name: 'sarah_j', lastMsg: 'Thanks for the ebook! It\'s really helpful.', time: '2m', unread: 1, status: 'online' },
  { id: 2, name: 'mike.dev', lastMsg: 'Sent you a DM!', time: '15m', unread: 0, status: 'offline' },
  { id: 3, name: 'alex_growth', lastMsg: 'When is the next webinar?', time: '1h', unread: 0, status: 'online' },
  { id: 4, name: 'design_daily', lastMsg: 'Awesome content as always!', time: '3h', unread: 0, status: 'offline' },
  { id: 5, name: 'tejas_codes', lastMsg: 'Looking forward to it.', time: '12h', unread: 0, status: 'offline' },
];

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  return (
    <div className="h-screen flex animate-fadeIn overflow-hidden">
      {/* Contact List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-accent italic">Messages</h1>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search chats..." className="input py-2 pl-10 text-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex gap-4 transition-colors hover:bg-secondary/50 ${
                selectedContact.id === contact.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0" />
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-accent text-sm underline cursor-pointer">@{contact.name}</span>
                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <p className={`text-xs truncate ${contact.unread ? 'text-accent font-bold' : 'text-gray-500'}`}>
                  {contact.lastMsg}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center mt-1">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-secondary/20">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full" />
                <div>
                  <h3 className="font-bold text-accent">@{selectedContact.name}</h3>
                  <p className="text-xs text-gray-400">{selectedContact.status === 'online' ? 'Active now' : 'Seen 2h ago'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-secondary rounded-xl text-gray-500 transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="p-2.5 hover:bg-secondary rounded-xl text-gray-500 transition-colors"><Video className="w-5 h-5" /></button>
                <button className="p-2.5 hover:bg-secondary rounded-xl text-gray-500 transition-colors"><Info className="w-5 h-5" /></button>
              </div>
            </header>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex justify-center">
                <span className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 uppercase tracking-widest">Today</span>
              </div>
              
              {/* Other Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full mt-auto" />
                <div className="max-w-[60%]">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-soft text-sm text-accent leading-relaxed">
                    Hey! I just commented on your latest reel. Can you send me the ebook link? 📚
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 ml-1">10:42 AM</span>
                </div>
              </div>

              {/* Automated Response */}
              <div className="flex flex-col items-end gap-2">
                <div className="max-w-[60%]">
                  <div className="bg-accent text-white p-4 rounded-2xl rounded-br-sm shadow-soft text-sm leading-relaxed">
                    Hey there! Thanks for your interest. Here is your link: <br />
                    <span className="underline font-bold text-brand cursor-pointer">instaauto.com/ebook-download</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-2 mr-1">
                    <span className="text-[10px] text-gray-400">10:42 AM • Automated</span>
                    <CheckCheck className="w-3 h-3 text-brand" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="max-w-4xl mx-auto relative flex items-center gap-4">
                <button className="p-2 hover:bg-secondary rounded-xl text-gray-400"><Smile className="w-6 h-6" /></button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="input w-full pr-12"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-accent text-white rounded-lg hover:bg-brand transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 hover:bg-secondary rounded-xl text-gray-400"><ImageIcon className="w-6 h-6" /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6">
              <Send className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-accent">Your Messages</h2>
            <p className="text-gray-500 mt-2 max-w-sm">Select a contact to view your conversation history and manage automated replies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
