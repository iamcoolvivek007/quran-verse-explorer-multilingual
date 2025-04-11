
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, AlertTriangle, Upload } from 'lucide-react';
import BookDataLoader from '@/components/BookDataLoader';
import MainNavigation from '@/components/MainNavigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import JsonImporter from '@/components/JsonImporter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookDataManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <MainNavigation />
        </div>
      </header>
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-book-gold/10 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-book-gold" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-book-title">Sacred Texts Data Center</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Download and store sacred texts from verified sources to your Supabase database for offline reading and research
            </p>
          </div>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>API Authentication Issues</AlertTitle>
          <AlertDescription>
            We're currently experiencing issues with some third-party APIs. Some texts will be populated with placeholder data until API connections are restored.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="api-loader" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="api-loader">API Data Loader</TabsTrigger>
            <TabsTrigger value="json-import">JSON Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-loader" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <BookDataLoader />
          </TabsContent>
          
          <TabsContent value="json-import" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <JsonImporter />
          </TabsContent>
        </Tabs>

        <div className="mt-10 text-center text-sm text-slate-500">
          <p>All texts are stored in your Supabase database for offline access.</p>
          <p>You can manage your data and customize the app's content through this interface.</p>
        </div>
      </div>
    </div>
  );
};

export default BookDataManager;
