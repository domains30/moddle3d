export const htmlTemplate = ({ body, style }: { style?: string; body: string }) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moddle 3D</title>
        <style>
          ${style}
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
