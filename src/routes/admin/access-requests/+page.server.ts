import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { 
  getPendingAccessRequests, 
  getAccessRequestById, 
  updateAccessRequestStatus,
  getUserById
} from '$lib/server/db/index.js';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated and is an admin
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // In a real application, you would check if the user has admin privileges
  // For now, we'll assume all authenticated users can access this page
  
  // Get all pending access requests
  const pendingRequests = await getPendingAccessRequests();
  
  return {
    pendingRequests
  };
};

export const actions: Actions = {
  approve: async ({ request, locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    const requestId = data.get('requestId');
    const notes = data.get('notes')?.toString() || '';
    
    if (!requestId) {
      return { success: false, message: 'Request ID is required' };
    }
    
    try {
      // Get the access request
      const accessRequest = await getAccessRequestById(Number(requestId));
      
      if (!accessRequest) {
        return { success: false, message: 'Access request not found' };
      }
      
      // Update the access request status to approved
      const updatedRequest = await updateAccessRequestStatus(
        Number(requestId),
        'approved',
        locals.user.id,
        notes
      );
      
      if (!updatedRequest) {
        return { success: false, message: 'Failed to update access request' };
      }
      
      // In a real application, you would:
      // 1. Create a user in Stack Auth with a disabled state
      // 2. Send a welcome email with a password reset link
      
      return { 
        success: true, 
        message: `Access request for ${accessRequest.email} has been approved` 
      };
    } catch (error) {
      console.error('Error approving access request:', error);
      return { 
        success: false, 
        message: 'An error occurred while approving the access request' 
      };
    }
  },
  
  reject: async ({ request, locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    const requestId = data.get('requestId');
    const notes = data.get('notes')?.toString() || '';
    
    if (!requestId) {
      return { success: false, message: 'Request ID is required' };
    }
    
    try {
      // Get the access request
      const accessRequest = await getAccessRequestById(Number(requestId));
      
      if (!accessRequest) {
        return { success: false, message: 'Access request not found' };
      }
      
      // Update the access request status to rejected
      const updatedRequest = await updateAccessRequestStatus(
        Number(requestId),
        'rejected',
        locals.user.id,
        notes
      );
      
      if (!updatedRequest) {
        return { success: false, message: 'Failed to update access request' };
      }
      
      // In a real application, you would send a rejection email
      
      return { 
        success: true, 
        message: `Access request for ${accessRequest.email} has been rejected` 
      };
    } catch (error) {
      console.error('Error rejecting access request:', error);
      return { 
        success: false, 
        message: 'An error occurred while rejecting the access request' 
      };
    }
  }
};
