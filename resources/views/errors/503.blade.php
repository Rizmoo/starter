<x-errors.page
    :code="503"
    :title="__('Service unavailable')"
    :heading="__('Closed for a tune-up')"
    :message="__('The app is taking a short break for maintenance. We will be back soon.')"
    :action-label="__('Go home')"
    :action-url="url('/')"
/>
