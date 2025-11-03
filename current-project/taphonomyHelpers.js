/**
 * Taphonomy Helper Functions
 * 
 * This file contains all the database logic for handling taphonomy data.
 * These functions are called from your main API endpoints to keep them clean and modular.
 */

/**
 * Helper function to get or create lookup table IDs
 * Checks if a value exists in a lookup table, returns its ID if found, creates it if not
 * 
 * @param {Object} connection - MySQL connection/promise object
 * @param {string} tableName - Base name of the lookup table (e.g., 'staining_type')
 * @param {string} columnName - Column name in lookup table (e.g., 'staining_type_name')
 * @param {string} value - The value to look up or create
 * @returns {Promise<number>} The ID from the lookup table
 */
async function getOrCreateLookupId(connection, tableName, columnName, value) {
    // First, try to find existing entry
    const [rows] = await connection.query(
        `SELECT ${tableName}_id FROM ${tableName}_lookup WHERE ${columnName} = ?`,
        [value]
    );
    
    if (rows.length > 0) {
        return rows[0][`${tableName}_id`];
    }
    
    // If not found, create new entry
    const [result] = await connection.query(
        `INSERT INTO ${tableName}_lookup (${columnName}) VALUES (?)`,
        [value]
    );
    
    return result.insertId;
}

/**
 * Save multiple selections to a junction table
 * Deletes old entries and creates new ones based on current selections
 * 
 * @param {Object} connection - MySQL connection/promise object
 * @param {number} taphonomyId - The taphonomy_id to link entries to
 * @param {string} tableName - Name of junction table (e.g., 'staining')
 * @param {string} refColumnName - Foreign key column name (e.g., 'staining_type_id')
 * @param {string} lookupTableName - Base name of lookup table (e.g., 'staining_type')
 * @param {string} lookupColumnName - Column name in lookup table (e.g., 'staining_type_name')
 * @param {Array<string>} values - Array of selected values
 */
async function saveMultipleSelections(connection, taphonomyId, tableName, refColumnName, lookupTableName, lookupColumnName, values) {
    // First, delete existing entries for this taphonomy_id
    await connection.query(
        `DELETE FROM ${tableName} WHERE taphonomy_id = ?`,
        [taphonomyId]
    );
    
    // Then insert new entries
    if (values && values.length > 0) {
        for (const value of values) {
            // Get or create the lookup table ID
            const lookupId = await getOrCreateLookupId(connection, lookupTableName, lookupColumnName, value);
            
            // Insert into junction table
            await connection.query(
                `INSERT INTO ${tableName} (taphonomy_id, ${refColumnName}) VALUES (?, ?)`,
                [taphonomyId, lookupId]
            );
        }
    }
}

/**
 * Main function to save taphonomy data
 * Creates or updates a taphonomy record and all associated junction table entries
 * 
 * @param {Object} connection - MySQL connection/promise object
 * @param {number} specimenId - The specimen ID
 * @param {number} boneId - The bone ID  
 * @param {Object} taphonomyData - Object containing arrays of selected values for each category
 * @param {number|null} existingTaphonomyId - Existing taphonomy_id if updating, null for new
 * @returns {Promise<number>} The taphonomy_id (new or existing)
 */
async function saveTaphonomyData(connection, specimenId, boneId, taphonomyData, existingTaphonomyId = null) {
    let taphonomyId = existingTaphonomyId;
    
    // If no existing taphonomy_id, create new taphonomy record
    if (!taphonomyId) {
        const [taphonomyResult] = await connection.query(
            `INSERT INTO taphonomy (specimen_id, bone_id, date_of_record) VALUES (?, ?, CURDATE())`,
            [specimenId, boneId]
        );
        taphonomyId = taphonomyResult.insertId;
        console.log('Created new taphonomy record with ID:', taphonomyId);
    } else {
        // Update the date_of_record for existing record
        await connection.query(
            `UPDATE taphonomy SET date_of_record = CURDATE() WHERE taphonomy_id = ?`,
            [taphonomyId]
        );
        console.log('Updated existing taphonomy record:', taphonomyId);
    }
    
    // Handle staining (multiple selections)
    if (taphonomyData.staining !== undefined) {
        await saveMultipleSelections(
            connection,
            taphonomyId,
            'staining',
            'staining_type_id',
            'staining_type',
            'staining_type_name',
            taphonomyData.staining || []
        );
        console.log('Saved staining data:', taphonomyData.staining);
    }
    
    // Handle surface damage (multiple selections)
    if (taphonomyData.surface_damage !== undefined) {
        await saveMultipleSelections(
            connection,
            taphonomyId,
            'surface_damage',
            'surface_damage_ref_id',
            'surface_damage',
            'damage_type_name',
            taphonomyData.surface_damage || []
        );
        console.log('Saved surface damage data:', taphonomyData.surface_damage);
    }
    
    // Handle cultural modifications (multiple selections)
    if (taphonomyData.cultural_modifications !== undefined) {
        await saveMultipleSelections(
            connection,
            taphonomyId,
            'cultural_modifications',
            'cultural_modification_ref_id',
            'cultural_modification',
            'modification_type_name',
            taphonomyData.cultural_modifications || []
        );
        console.log('Saved cultural modifications:', taphonomyData.cultural_modifications);
    }
    
    // Handle curation modifications (multiple selections)
    if (taphonomyData.curation_modifications !== undefined) {
        await saveMultipleSelections(
            connection,
            taphonomyId,
            'curation_modifications',
            'curation_modification_ref_id',
            'curation_modification',
            'curation_modification_type',
            taphonomyData.curation_modifications || []
        );
        console.log('Saved curation modifications:', taphonomyData.curation_modifications);
    }
    
    // Handle adherent materials (multiple selections) - if table exists
    if (taphonomyData.adherent_materials !== undefined) {
        try {
            await saveMultipleSelections(
                connection,
                taphonomyId,
                'adherent_materials',
                'adherent_material_ref_id',
                'adherent_material',
                'material_type_name',
                taphonomyData.adherent_materials || []
            );
            console.log('Saved adherent materials:', taphonomyData.adherent_materials);
        } catch (error) {
            // Table might not exist yet - log but don't fail
            console.log('Adherent materials table not found, skipping...');
        }
    }
    
    return taphonomyId;
}

/**
 * Load taphonomy data for a bone entry
 * Retrieves all selected values from junction tables
 * 
 * @param {Object} connection - MySQL connection/promise object
 * @param {number} taphonomyId - The taphonomy_id to load
 * @returns {Promise<Object>} Object containing arrays of selected values for each category
 */
async function loadTaphonomyData(connection, taphonomyId) {
    if (!taphonomyId) {
        // Return empty structure if no taphonomy data
        return {
            staining: [],
            surface_damage: [],
            adherent_materials: [],
            curation_modifications: [],
            cultural_modifications: []
        };
    }
    
    try {
        // Get staining
        const [staining] = await connection.query(
            `SELECT stl.staining_type_name 
             FROM staining s
             JOIN staining_type_lookup stl ON s.staining_type_id = stl.staining_type_id
             WHERE s.taphonomy_id = ?`,
            [taphonomyId]
        );
        
        // Get surface damage
        const [surfaceDamage] = await connection.query(
            `SELECT sdl.damage_type_name 
             FROM surface_damage sd
             JOIN surface_damage_lookup sdl ON sd.surface_damage_ref_id = sdl.surface_damage_id
             WHERE sd.taphonomy_id = ?`,
            [taphonomyId]
        );
        
        // Get cultural modifications
        const [culturalMods] = await connection.query(
            `SELECT cml.modification_type_name 
             FROM cultural_modifications cm
             JOIN cultural_modification_lookup cml ON cm.cultural_modification_ref_id = cml.cultural_modification_id
             WHERE cm.taphonomy_id = ?`,
            [taphonomyId]
        );
        
        // Get curation modifications
        const [curationMods] = await connection.query(
            `SELECT cml.curation_modification_type 
             FROM curation_modifications cm
             JOIN curation_modification_lookup cml ON cm.curation_modification_ref_id = cml.curation_modification_id
             WHERE cm.taphonomy_id = ?`,
            [taphonomyId]
        );
        
        // Get adherent materials (if table exists)
        let adherentMats = [];
        try {
            const [result] = await connection.query(
                `SELECT aml.material_type_name 
                 FROM adherent_materials am
                 JOIN adherent_material_lookup aml ON am.adherent_material_ref_id = aml.adherent_material_id
                 WHERE am.taphonomy_id = ?`,
                [taphonomyId]
            );
            adherentMats = result;
        } catch (error) {
            // Table doesn't exist yet, return empty array
            console.log('Adherent materials table not found, returning empty array');
        }
        
        return {
            staining: staining.map(s => s.staining_type_name),
            surface_damage: surfaceDamage.map(sd => sd.damage_type_name),
            cultural_modifications: culturalMods.map(cm => cm.modification_type_name),
            curation_modifications: curationMods.map(cm => cm.curation_modification_type),
            adherent_materials: adherentMats.map(am => am.material_type_name)
        };
    } catch (error) {
        console.error('Error loading taphonomy data:', error);
        throw error;
    }
}

/**
 * Delete taphonomy data
 * Removes all junction table entries and the main taphonomy record
 * 
 * @param {Object} connection - MySQL connection/promise object
 * @param {number} taphonomyId - The taphonomy_id to delete
 */
async function deleteTaphonomyData(connection, taphonomyId) {
    if (!taphonomyId) return;
    
    try {
        console.log('Deleting taphonomy data for ID:', taphonomyId);
        
        // Delete from all junction tables
        // (Will cascade automatically if foreign keys are set up with ON DELETE CASCADE)
        await connection.query('DELETE FROM staining WHERE taphonomy_id = ?', [taphonomyId]);
        await connection.query('DELETE FROM surface_damage WHERE taphonomy_id = ?', [taphonomyId]);
        await connection.query('DELETE FROM cultural_modifications WHERE taphonomy_id = ?', [taphonomyId]);
        await connection.query('DELETE FROM curation_modifications WHERE taphonomy_id = ?', [taphonomyId]);
        
        // Try to delete adherent materials if table exists
        try {
            await connection.query('DELETE FROM adherent_materials WHERE taphonomy_id = ?', [taphonomyId]);
        } catch (error) {
            // Table doesn't exist yet, skip
            console.log('Adherent materials table not found, skipping...');
        }
        
        // Delete main taphonomy record
        await connection.query('DELETE FROM taphonomy WHERE taphonomy_id = ?', [taphonomyId]);
        
        console.log('Successfully deleted taphonomy data');
    } catch (error) {
        console.error('Error deleting taphonomy data:', error);
        throw error;
    }
}

// Export the functions
module.exports = {
    saveTaphonomyData,
    loadTaphonomyData,
    deleteTaphonomyData
};