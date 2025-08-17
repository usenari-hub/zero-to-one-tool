-- Update the record_share_conversion function with new commission percentages
-- Degree 1: 50%, Degree 2: 25%, Degree 3: 10%, Degree 4: 7.5%, Degree 5: 5%, Degree 6: 2.5%

CREATE OR REPLACE FUNCTION public.record_share_conversion(click_id_param uuid, buyer_id_param uuid, purchase_amount_param numeric, degree_param integer DEFAULT 1)
 RETURNS json
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
    click_record share_clicks%ROWTYPE;
    share_link_record share_links%ROWTYPE;
    listing_record listings%ROWTYPE;
    commission_amount DECIMAL(10,2);
    commission_percentage DECIMAL(5,2);
    conversion_id UUID;
BEGIN
    -- Get click record
    SELECT * INTO click_record FROM share_clicks WHERE id = click_id_param;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Click not found');
    END IF;
    
    -- Get share link record
    SELECT * INTO share_link_record FROM share_links WHERE id = click_record.share_link_id;
    
    -- Get listing record
    SELECT * INTO listing_record FROM listings WHERE id = share_link_record.listing_id;
    
    -- Calculate commission based on degree - NEW PERCENTAGES
    commission_percentage := CASE degree_param
        WHEN 1 THEN 50.0  -- 50% for 1st degree
        WHEN 2 THEN 25.0  -- 25% for 2nd degree
        WHEN 3 THEN 10.0  -- 10% for 3rd degree
        WHEN 4 THEN 7.5   -- 7.5% for 4th degree
        WHEN 5 THEN 5.0   -- 5% for 5th degree
        WHEN 6 THEN 2.5   -- 2.5% for 6th degree
        ELSE 0.0
    END;
    
    commission_amount := (purchase_amount_param * listing_record.reward_percentage / 100) * commission_percentage / 100;
    
    -- Insert conversion record
    INSERT INTO share_conversions (
        share_click_id,
        share_link_id,
        listing_id,
        buyer_id,
        purchase_amount,
        commission_amount,
        commission_percentage,
        degree
    ) VALUES (
        click_id_param,
        share_link_record.id,
        share_link_record.listing_id,
        buyer_id_param,
        purchase_amount_param,
        commission_amount,
        commission_percentage,
        degree_param
    ) RETURNING id INTO conversion_id;
    
    -- Update click record
    UPDATE share_clicks 
    SET 
        converted = TRUE,
        conversion_amount = commission_amount,
        conversion_at = NOW()
    WHERE id = click_id_param;
    
    -- Update share link stats
    UPDATE share_links 
    SET 
        conversions = conversions + 1,
        bacon_earned = bacon_earned + commission_amount,
        updated_at = NOW()
    WHERE id = share_link_record.id;
    
    RETURN json_build_object(
        'success', true,
        'conversion_id', conversion_id,
        'commission_amount', commission_amount,
        'commission_percentage', commission_percentage
    );
END;
$function$;