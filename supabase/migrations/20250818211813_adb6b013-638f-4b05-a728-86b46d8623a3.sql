-- Fix audit trail RLS policies to allow system triggers to work
DROP POLICY IF EXISTS "Admin audit trail access" ON public.audit_trail;

-- Allow system/triggers to insert audit records (for automatic audit logging)
CREATE POLICY "System can insert audit records" 
ON public.audit_trail 
FOR INSERT 
WITH CHECK (true);

-- Only admins can read audit trail records
CREATE POLICY "Admins can read audit trail" 
ON public.audit_trail 
FOR SELECT 
USING (public.is_admin());

-- Only admins can update/delete audit trail records (if needed)
CREATE POLICY "Admins can modify audit trail" 
ON public.audit_trail 
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete audit trail" 
ON public.audit_trail 
FOR DELETE
USING (public.is_admin());