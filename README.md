# Novo Todo App

A feature-rich, web component-based Todo application built with vanilla JavaScript and the Web Component API.

## Features

- Add, remove, and toggle completion of tasks
- Fetch random tasks from an external API
- Responsive design
- Categorize tasks and filter by category
- Set due dates for tasks
- Local storage persistence
- Debug mode for easier troubleshooting

## Technologies Used

- Vanilla JavaScript
- Web Component API
- Vite (for building and development)
- SCSS for styling
- localStorage for data persistence
- Fetch API for external data retrieval

## Project Structure

## Setup and Installation

1. Clone the repository:



git clone https://github.com/yourusername/novo-todo-app.git cd novo-todo-app

2. Install dependencies:

npm install

3. Run the development server:



npm run dev


4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

npm run build

The built files will be in the `dist/` directory.

## Features in Detail

### Task Management
- Add new tasks with a title, category, and due date
- Mark tasks as complete/incomplete
- Remove individual tasks

### Categories
- Predefined categories for tasks
- Filter tasks by category using category buttons

### API Integration
- Fetch random tasks from the DummyJSON Todo API
- Specify the number of tasks to fetch

### Data Persistence
- Tasks are saved to and loaded from localStorage

### Bulk Actions
- Delete all tasks
- Delete only manually added tasks
- Delete only API-fetched tasks

### Styling
- SCSS for enhanced CSS functionality
- BEM methodology for CSS class naming

### Debug Mode
- Console logging for easier debugging and development

## Customization

- Modify the `CATEGORIES` array in `src/config.js` to change available categories
- Adjust the API URL in `src/config.js` to your API URL
- Custommize title and header title 



## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/lukaongit/novo-todo-app/issues) if you want to contribute.

## License

No Licence


The built files will be in the `dist/` directory.

### Proxying with Nginx

To serve the application using Nginx:

1. Build the project as described above.

2. Copy the contents of the `dist/` directory to your web server's root (e.g., `/var/www/html/`).

3. Create a new Nginx server block configuration (e.g., `/etc/nginx/sites-available/novo-todo-app`):

  
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }

Enable the site by creating a symlink:

sudo ln -s /etc/nginx/sites-available/novo-todo-app /etc/nginx/sites-enabled/



Test the Nginx configuration:

sudo nginx -t



If the test is successful, restart Nginx:

sudo systemctl restart nginx

Proxying with Apache
To serve the application using Apache:

Build the project as described in the "Building for Production" section.

Copy the contents of the dist/ directory to your web server's root (e.g., /var/www/html/).

Ensure that the Apache mod_rewrite module is enabled:

sudo a2enmod rewrite



Create a new Apache virtual host configuration (e.g., /etc/apache2/sites-available/novo-todo-app.conf):

<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>



Enable the site:

sudo a2ensite novo-todo-app.conf



Create a .htaccess file in the /var/www/html/ directory with the following content:

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>



Test the Apache configuration:

sudo apache2ctl configtest



If the test is successful, restart Apache:

sudo systemctl restart apache2





