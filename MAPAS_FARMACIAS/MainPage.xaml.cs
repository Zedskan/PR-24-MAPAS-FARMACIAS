namespace MAPAS_FARMACIAS
{
    public partial class MainPage : ContentPage
    {

        public MainPage()
        {
            InitializeComponent();

            // HTML con Leaflet
            var htmlSource = new HtmlWebViewSource();
            htmlSource.Html = @"
            <!DOCTYPE html>
            <html>
            <head>
                <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
                <link rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' />
                <style>
                    html, body, #map { height: 100%; margin: 0; }
                </style>
            </head>
            <body>
                <div id='map'></div>
                <script src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'></script>
                <script>
                    var map = L.map('map').setView([51.505, -0.09], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data © <a href=""https://openstreetmap.org"">OpenStreetMap</a> contributors'
                    }).addTo(map);
                </script>
            </body>
            </html>";

            MapWebView.Source = htmlSource;
        }

        
    }

}
