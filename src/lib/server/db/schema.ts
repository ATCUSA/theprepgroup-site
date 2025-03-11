import { pgTable, serial, text, integer, timestamp, boolean, date, jsonb } from 'drizzle-orm/pg-core';

// Main user table - updated to use birthdate instead of age
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

// User profile information
export const userProfile = pgTable('user_profile', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	firstName: text('first_name'),
	lastName: text('last_name'),
	bio: text('bio'),
	phone: text('phone'),
	address: text('address'),
	city: text('city'),
	state: text('state'),
	zip: text('zip'),
	country: text('country'),
	profileImage: text('profile_image'), // URL to profile image
	showInDirectory: boolean('show_in_directory').default(false),
	directoryPreferences: jsonb('directory_preferences').default({}), // What info to show in directory
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// Access request table
export const accessRequest = pgTable('access_request', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	reason: text('reason'), // Why they want to join
	phone: text('phone'),
	address: text('address'),
	city: text('city'),
	state: text('state'),
	zipCode: text('zip_code'),
	country: text('country'),
	status: text('status').notNull().default('pending'), // pending, approved, rejected
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	processedAt: timestamp('processed_at', { withTimezone: true, mode: 'date' }),
	processedBy: text('processed_by').references(() => user.id),
	notes: text('notes') // Admin notes on the request
});

// Session table - unchanged
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Type exports
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type UserProfile = typeof userProfile.$inferSelect;
export type AccessRequest = typeof accessRequest.$inferSelect;
