<x-errors.page
    :code="404"
    :title="__('Page not found')"
    :heading="__('This page drifted away')"
    :message="__('We looked across the water, but this path does not exist.')"
    :action-label="__('Go home')"
    :action-url="url('/')"
/>
