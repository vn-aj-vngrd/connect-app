"use server";

import { z } from "zod";
import {
  contactSchema,
  tagSchema,
  userSchema,
  changePasswordSchema,
  newEmailSchema,
  passwordSchema,
} from "@/schemas";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { Response } from "@/types";
import { notFound, redirect } from "next/navigation";

// Cookies

function getHeaders() {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(".AspNetCore.Identity.Application");

  if (!cookieValue?.value) {
    return null;
  }

  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Cookie", `${cookieValue.name}=${cookieValue.value}`);

  return headers;
}

// Auth

type User = z.infer<typeof userSchema>;
type ChangePassword = z.infer<typeof changePasswordSchema>;
type NewEmail = z.infer<typeof newEmailSchema>;
type Password = z.infer<typeof passwordSchema>;

export async function getUser(): Promise<User> {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/user`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(api, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/logout");
    }

    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export async function updateUser(data: User): Promise<User> {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/user`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(api, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = (await res.json()) as {
      message: Response<null>["message"];
      errors: Response<null>["errors"];
    };

    throw new Error(
      error.errors?.[0]?.description || error?.message || "Something went wrong"
    );
  }

  revalidate({
    user: true,
  });

  return res.json();
}

export async function changeEmail(data: NewEmail) {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/change-email`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(api, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = (await res.json()) as {
      message: Response<null>["message"];
      errors: Response<null>["errors"];
    };

    throw new Error(
      error.errors?.[0]?.description || error?.message || "Something went wrong"
    );
  }

  revalidate({
    user: true,
  });

  return;
}

export async function changePassword(data: ChangePassword) {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(api, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });

  if (!res.ok) {
    const error = (await res.json()) as {
      message: Response<null>["message"];
      errors: Response<null>["errors"];
    };

    throw new Error(
      error.errors?.[0]?.description || error?.message || "Something went wrong"
    );
  }

  revalidate({
    user: true,
  });

  return;
}

export async function deleteAccount(data: Password) {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(api, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to delete account");
  }

  revalidate({
    user: true,
  });

  redirect("/logout");
}

// Tags

export type Tag = z.infer<typeof tagSchema>;

export type TagWithId = Tag & { id: number };

export async function getTags(): Promise<TagWithId[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
    next: {
      tags: ["tags"],
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/logout");
    }

    throw new Error("Failed to fetch tags");
  }

  return res.json();
}

export async function getTag(id: number): Promise<TagWithId> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
    next: {
      tags: ["tag"],
    },
  });

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}

export async function addTag(data: Tag): Promise<Response> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  revalidate({
    tag: true,
    tags: true,
    contact: true,
    contacts: true,
  });

  return {
    data: await res.json(),
  };
}

export async function editTag(data: TagWithId) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags/${data.id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error);
  }

  revalidate({
    tag: true,
    tags: true,
    contact: true,
    contacts: true,
  });

  return;
}

export async function deleteTag(id: number) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers,
  });

  revalidate({
    tag: true,
    tags: true,
    contact: true,
    contacts: true,
  });

  if (!res.ok) {
    throw new Error("Failed to delete tag");
  }

  redirect("/all");

  return;
}

export async function checkTagNameExists(name: string): Promise<boolean> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tags/exists?name=${name}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to check if tag name exists");
  }

  return res.json();
}

// Contacts

export type Contact = z.infer<typeof contactSchema>;

export type ContactWithId = Contact & {
  id: number;
};

export type ContactWithTags = ContactWithId & {
  tags: TagWithId[];
};

type ContactListResponse = {
  data: ContactWithTags[];
  total: number;
  startingIndex: number;
  limit: number;
};

type ContactFilter = {
  tagId?: number;
  search?: string;
  sortField?: string;
  sortDescending?: boolean;
  filters?: {
    [key: string]: string | number | boolean;
  };
  startingIndex?: number;
  limit?: number;
};

export async function getContact(id: number): Promise<ContactWithTags> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
    next: {
      tags: ["contact"],
    },
  });

  if (!res.ok) {
    return notFound();
  }

  return res.json();
}

export async function getContacts(
  query: ContactFilter
): Promise<ContactListResponse> {
  const {
    tagId,
    search,
    sortField,
    sortDescending,
    filters,
    startingIndex,
    limit,
  } = query;

  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts`;

  const queryParams = [];

  if (tagId) {
    queryParams.push(`tagId=${tagId}`);
  }

  if (search) {
    queryParams.push(`search=${search}`);
  }

  if (sortField) {
    queryParams.push(`sortField=${sortField}`);
  }

  if (sortDescending) {
    queryParams.push(`sortDescending=${sortDescending}`);
  }

  if (filters) {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        const value = filters[key];
        queryParams.push(`${key}=${value}`);
      }
    }
  }

  if (startingIndex) {
    queryParams.push(`startingIndex=${startingIndex}`);
  }

  if (limit) {
    queryParams.push(`limit=${limit}`);
  }

  if (queryParams.length > 0) {
    apiUrl += `?${queryParams.join("&")}`;
  }

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
    next: {
      tags: ["contacts"],
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect("/logout");
    }

    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export async function favoriteContact(id: number) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}/favorite`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to favorite contact");
  }

  revalidate({
    contact: true,
    contacts: true,
  });

  return;
}

export async function favoriteContacts(ids: number[], isFavorite: boolean) {
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/favorite`;

  let _ids: string[] = [];

  ids.forEach((id) => {
    _ids.push(`ids=${id}`);
  });

  apiUrl += `?${_ids.join("&")}`;
  apiUrl += `&isFavorite=${isFavorite}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      isFavorite,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to favorite contacts");
  }

  revalidate({
    contact: true,
    contacts: true,
  });

  return;
}

export async function addContact(data: Contact) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error);
  }

  revalidate({
    contact: true,
    contacts: true,
  });

  const contact = (await res.json()) as ContactWithTags;

  redirect(`/contacts/${contact.id}`);
}

export async function editContact(data: ContactWithId) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/${data.id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error);
  }

  revalidate({
    contact: true,
    contacts: true,
  });

  return;
}

export async function deleteContact(id: number, redirectToAll = false) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/${id}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers,
  });

  revalidate({
    contact: true,
    contacts: true,
  });

  if (!res.ok) {
    throw new Error("Failed to delete contact");
  }

  if (redirectToAll) redirect("/all");

  return;
}

export async function deleteContacts(ids: number[]) {
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/bulk`;

  let _ids: string[] = [];

  ids.forEach((id) => {
    _ids.push(`ids=${id}`);
  });

  apiUrl += `?${_ids.join("&")}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers,
  });

  revalidate({
    contact: true,
    contacts: true,
  });

  if (!res.ok) {
    throw new Error("Failed to delete contacts");
  }

  return;
}

export async function tagContacts(ids: number[], tagIds: number[]) {
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/contacts/tags`;

  let _ids: string[] = [];

  ids.forEach((id) => {
    _ids.push(`ids=${id}`);
  });

  apiUrl += `?${_ids.join("&")}`;

  const headers = getHeaders();

  if (!headers) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      tagIds,
    }),
  });

  revalidate({
    contact: true,
    contacts: true,
  });

  if (!res.ok) {
    throw new Error("Failed to update contact tags");
  }

  return;
}

export async function revalidate({
  contact = false,
  contacts = false,
  tag = false,
  tags = false,
  user = false,
}) {
  if (contact) {
    revalidateTag(`/contact`);
  }

  if (contacts) {
    revalidateTag("/contacts");
  }

  if (tag) {
    revalidateTag("/tag");
  }

  if (tags) {
    revalidateTag("/tags");
  }

  if (user) {
    revalidateTag("/user");
  }
}
